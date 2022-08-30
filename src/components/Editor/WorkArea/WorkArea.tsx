import * as React from 'react';
import { flushSync } from 'react-dom';
import { Set } from 'immutable';

import Connector from './Connector/Connector';
import PanelWrapper from '../Panel/PanelWrapper';
import Marquee from './Marquee';

import ContextMenu from '../ContextMenu/ContextMenu';
import ComboBox from '../ComboBox/ComboBox';

import dictionary from '../../../components/panels/dictionary';
import { getContextMenuItems, getContextMenuOpen } from '../../../domain/Menus';
import Measures from '../../../domain/Measures';
import getIndexFor from '../../../domain/PanelCatalog';

import rateLimiter from '../../../utils/rateLimiter';
import { DragCoords } from '../../../types/DragCoords';

import './WorkArea.css';
import '../Panel/Panel.css';

let resizeEvents: number[] = [];
let mouseMoveEvents: number[] = [];

const searchableItems = dictionary;
const searchableItemsIndex = getIndexFor(searchableItems);

const WorkArea = (props) => {
	const {
		machine,
		play, pause,
		graphState,
		focused, setFocus,
		connectorAnchor, setConnectorAnchor,
		makeConnection,
		workAreaOffset, setWorkAreaOffset,
		inclusiveSelection,
		setTimer
	} = props;

    const {
        panels, setPanels,
        panelCoords, setPanelCoords,
        connections, setConnections
    } = graphState;

	const {
		buildScreenSize,
		linear,
		snapping,
		selectInclusive,
		selectExclusive,
		computeEpCoords,
		getConnectionBuilderCoords,
		getStartConnectionCoords,
		getEndConnectionCoords,
		getVisibleObjects,
		getAnchorsPointsFor
	} = Measures({
		workAreaOffset,
		panelCoords
	});

	const workArea = React.useRef<any>();

	const [ searchBoxData, setSearchBoxData ] = React.useState<object | null>(null);

	const [ contextMenuData, setContextMenuData ] = React.useState<object | null>(null);
	const contextMenuItems = getContextMenuItems(machine, setWorkAreaOffset, setSearchBoxData);

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords>({ isDragging: false });
	const [ draw, redraw ] = React.useState(0);
	const [ screenSize, setScreenSize ] = React.useState(buildScreenSize());
	const [ selectedPanels, setSelectedPanels ] = React.useState<Set<number>>(Set());

	const [ backupSelectedPanels, setBackupSelectedPanels ] = React.useState<Set<number>>(Set());

	const getPanelIdsToMove = (contactPanelId) => {
		let panelIds = ((selectedPanels.size > 0) && selectedPanels.contains(contactPanelId)) ? Array.from(selectedPanels) : [contactPanelId];

		return panelIds
			.map((panelId) => panelCoords[panelId])
			.map((panelCoord) => panelCoord.group ? Array.from(panelCoord.group) : [])
			.flat()
			.concat(panelIds);
	};

	const mouseDown = (e) => {
		if (e.button != 0) return;

		if (contextMenuData != null) {
			if (e.target.closest('.ContextMenu')) return;

			setContextMenuData(null);
			return;
		}

		if (searchBoxData != null) {
			if (e.target.closest('.ComboBox')) return;

			setSearchBoxData(null);
			return;
		}

		const connected = e.target.classList.contains('Connected');
		const onWorkArea = e.target.classList.contains('WorkArea');

		const draggingPanel = e.target.classList.contains('Title');
		const resizingPanel = e.target.closest('.Resizer');
		const draggingWorkArea = onWorkArea && !e.shiftKey;
		const selectingArea = onWorkArea && e.shiftKey;
		const creatingInputConnection = e.target.classList.contains('InputEndpoint') && !connected;
		const creatingOutputConnection = e.target.classList.contains('OutputEndpoint') && !connected;
		const detachingInputConnection = (connectorAnchor == null) && e.target.classList.contains('InputEndpoint') && connected;

		if (
			!draggingPanel &&
			!resizingPanel &&
			!draggingWorkArea &&
			!selectingArea &&
			!creatingInputConnection &&
			!creatingOutputConnection &&
			!detachingInputConnection
		) return;

		if (resizingPanel) {
			const panel = e.target.closest('.Panel');
			const panelId = parseInt(panel.dataset.key);

			setDragCoords({
				isDragging: true,
				what: 'panel-resizer',
				el: panel,
				o: {
					x: Number(e.pageX),
					y: Number(e.pageY)
				},
				c: {
					x: panelCoords[panelId].width,
					y: panelCoords[panelId].height
				}
			});

			return;
		}

		if (draggingPanel) {
			const panel = e.target.closest('.Panel');
			const panelId = parseInt(panel.dataset.key);
			const panelIdsToMove = getPanelIdsToMove(panelId);
			const selectedPanelsAnchors = getAnchorsPointsFor(panelIdsToMove);

			setDragCoords({
				isDragging: true,
				what: 'panels',
				el: panel,
				o: {
					x: Number(e.pageX),
					y: Number(e.pageY)
				},
				os: selectedPanelsAnchors,
				c: {
					x: panelCoords[panelId].left,
					y: panelCoords[panelId].top
				}
			});

			return;
		}

		if (draggingWorkArea) {
			setDragCoords({
				isDragging: true,
				what: 'workarea',
				o: {
					x: Number(e.pageX),
					y: Number(e.pageY)
				},
				c: {
					x: workAreaOffset[0],
					y: workAreaOffset[1]
				}
			});

			return;
		}

		if (selectingArea) {
			const { top, left } = workArea.current.getBoundingClientRect();

			setDragCoords({
				isDragging: true,
				what: 'marquee',
				o: {
					x: Number(e.pageX) - left,
					y: Number(e.pageY) - top
				},
				c: {
					x: Number(e.pageX) - left,
					y: Number(e.pageY) - top
				}
			});

			if (!e.ctrlKey) {
				setBackupSelectedPanels(Set());
				setSelectedPanels(Set());
			} else {
				setBackupSelectedPanels(Set(selectedPanels));
			}

			return;
		}

		if (creatingInputConnection) {
			const toPanel = e.target.closest('.Panel');
			const toPanelId = parseInt(toPanel.dataset.key);

			setConnectorAnchor({
				fromRef: null,
				to: null,
				toRef: machine.getPanelInputRef(toPanelId, e.target.dataset.name),
				toPanelId,
				from: { x: e.pageX, y: e.pageY },
			});

			return;
		}

		if (creatingOutputConnection) {
			const fromPanel = e.target.closest('.Panel');
			const fromPanelId = parseInt(fromPanel.dataset.key);

			setConnectorAnchor({
				fromRef: machine.getPanelOutputRef(fromPanelId, e.target.dataset.name),
				fromPanelId,
				to: { x: e.pageX, y: e.pageY },
				toRef: null,
				from: null
			});

			return;
		}

		if (detachingInputConnection) {
			const toPanel = e.target.closest('.Panel');
			const toPanelId = parseInt(toPanel.dataset.key);

			const connection = machine.removeConnectionByTargetRef(machine.getPanelInputRef(toPanelId, e.target.dataset.name));
			if (connection == null) return;

			setConnectorAnchor({
				fromRef: connection.source,
				fromPanelId: connection.sourcePanelId,
				to: { x: e.pageX, y: e.pageY },
				toRef: null,
				from: null
			});

			return;
		}
	};

	const processMouseMove = (e) => {
		if (e.button != 0) return;

		e.preventDefault();

		if (!dragCoords.isDragging && connectorAnchor != null) {
			if (connectorAnchor.fromRef != null) {
				setConnectorAnchor({
					...connectorAnchor,
					to: { x: e.clientX, y: e.clientY }
				});
			}

			if (connectorAnchor.toRef != null) {
				setConnectorAnchor({
					...connectorAnchor,
					from: { x: e.clientX, y: e.clientY }
				});
			}
		}

		if (!dragCoords.isDragging) return;

		if (dragCoords.what == 'panel-resizer') {
			const distance = {
				dx: e.clientX - dragCoords.o.x,
				dy: e.clientY - dragCoords.o.y
			};

			const panelId = Number(dragCoords.el.dataset.key);

			const updates = {
				[panelId]: {
					...panelCoords[panelId],
					width: Math.max(panelCoords[panelId].minWidth, dragCoords.c.x + distance.dx),
                    height: Math.max(panelCoords[panelId].minHeight, dragCoords.c.y + distance.dy)
				}
			};

			setPanelCoords((panelCoords) => ({
				...panelCoords,
				...updates
			}));

			return false;
		}

		if (dragCoords.what == 'panels') {
			const func = (props.snap ? snapping : linear);

			const distance = {
				dx: e.clientX - dragCoords.o.x,
				dy: e.clientY - dragCoords.o.y
			};

			const updates =
				dragCoords.os.reduce((a, v) => {
					return {
						...a,
						[v.panelId]: {
							...panelCoords[v.panelId],
							left: func(v.o.x + distance.dx),
							top: func(v.o.y + distance.dy)
						}
					};
				}, {});

			setPanelCoords((panelCoords) => ({
				...panelCoords,
				...updates
			}));

			return false;
		}

		if (dragCoords.what == 'workarea') {
			setWorkAreaOffset([
				e.clientX - dragCoords.o.x + dragCoords.c.x,
				e.clientY - dragCoords.o.y + dragCoords.c.y
			]);

			return false;
		}

		if (dragCoords.what == 'marquee') {
			const { top, left } = workArea.current.getBoundingClientRect();

			const marqueeRight = e.pageX - left;
			const marqueeBottom = e.pageY - top;

			setDragCoords({
				...dragCoords,
				c: {
					x: marqueeRight,
					y: marqueeBottom
				}
			});

			const selection = {
				left: Math.min(dragCoords.o.x, dragCoords.c.x),
				top: Math.min(dragCoords.o.y, dragCoords.c.y),
				right: Math.max(dragCoords.o.x, dragCoords.c.x),
				bottom: Math.max(dragCoords.o.y, dragCoords.c.y)
			};

			const included =
				(inclusiveSelection ? selectInclusive : selectExclusive)(panels, panelCoords, selection)
					.map(({ panelId }) => panelId);

			setSelectedPanels(Set(included).concat(backupSelectedPanels));

			return false;
		}
	};

	const mouseMove = rateLimiter('mouse moved', processMouseMove, mouseMoveEvents, 50);

	const mouseUp = (e) => {
		if (e.button != 0) return;

		setDragCoords({ isDragging: false });

		if (
			(connectorAnchor != null && connectorAnchor.fromRef != null) &&
			e.target.classList.contains('InputEndpoint') &&
			!e.target.classList.contains('Connected')
		) {
			const toPanelEl = e.target.closest('.Panel');

			const toPanelId = parseInt(toPanelEl.dataset.key);
			const toRef = machine.getPanelInputRef(toPanelId, e.target.dataset.name);

			const newConnection = makeConnection(connectorAnchor.fromRef, toRef, connectorAnchor.fromPanelId, toPanelId);

			if (newConnection) {
				flushSync(() => {
					setConnections((connections) => [
						...connections,
						newConnection
					]);
				});
			}
		}

		if (
			(connectorAnchor != null && connectorAnchor.toRef != null) &&
			(e.target.classList.contains('OutputEndpoint'))
		) {
			const fromPanelEl = e.target.closest('.Panel');

			const fromPanelId = parseInt(fromPanelEl.dataset.key);
			const fromRef = machine.getPanelOutputRef(fromPanelId, e.target.dataset.name);

			const newConnection = makeConnection(fromRef, connectorAnchor.toRef, fromPanelId, connectorAnchor.toPanelId);

			if (newConnection) {
				flushSync(() => {
					setConnections((connections) => [
						...connections,
						newConnection
					]);
				});
			}
		}

		setConnectorAnchor(null);

		redraw(Math.random());
	};

	const mouseClick = (e) => {
		if (e.button != 0) return;

		setFocus(null);

		if (e.shiftKey || e.ctrlKey) {
			console.log(panels, panelCoords);
			console.log(connections);
			return;
		}

		setSelectedPanels(Set());

		return true;
	};

	const mouseDoubleClick = (e) => {
		if (e.button != 0) return;

		setSearchBoxData({
            left: e.clientX,
            top: e.clientY
        });

		return true;
	};

	const contextMenuOpen = getContextMenuOpen(selectedPanels, setContextMenuData, setSearchBoxData);

	const toggleSelection = (panelId) => {
		if (selectedPanels.has(panelId)) {
			setSelectedPanels(selectedPanels.delete(panelId));
		} else {
			setSelectedPanels(selectedPanels.add(panelId));
		}
	};

	const processResize = () => {
		setScreenSize(buildScreenSize());
	};

	if (!window.onresize) {
		window.onresize = rateLimiter('resize', processResize, resizeEvents, 500);
	}

	const renderPanel = (panel, panelCoord) => {
		const isFocused = focused === panel.panelId;
		const isSelected = selectedPanels.has(panel.panelId);

		return (
			<PanelWrapper
				key={panel.panelId}
				panel={panel} setPanels={setPanels}
				panelCoord={panelCoord} setPanelCoords={setPanelCoords}
				machine={machine}
				workAreaOffset={workAreaOffset}
				connections={connections}
				connectorAnchor={connectorAnchor}
				isFocused={isFocused}
				isSelected={isSelected}
				computeEpCoords={computeEpCoords}
				onSelect={(e) => {
					e.stopPropagation();
					setSearchBoxData(null);
					setContextMenuData(null);

					const panel = e.target.closest('.Panel');
					const panelId = parseInt(panel.dataset.key);

					setFocus(panelId);

					if (!e.shiftKey) return true;

					if (!e.ctrlKey) {
						setSelectedPanels(Set([panelId]));
					} else {
						toggleSelection(panelId);
					}

					return true;
				}}
				redraw={redraw}
				/>
		);
	};

	const renderConnection = (connection, key) => {
		return (<Connector
			key={key}
			coordsStart={getStartConnectionCoords(connection)}
			coordsEnd={getEndConnectionCoords(connection)}
			roundCorner={true}
			endArrow={true}
			stroke={'#ADA257'}
			svgClass={`Signal-${connection.signal}`}
			strokeWidth={2}
			workArea={workArea}
			play={play} pause={pause}
			draw={draw}
		/>);
	};

	const renderSearchBox = () => {
		return searchBoxData != null
			? <>
				<ComboBox
					{...searchBoxData}
					items={searchableItems}
					index={searchableItemsIndex}
					addPanel={machine.addPanel}
					emptySearchMessage="Search panels by name or tag"
					setSearchBoxData={setSearchBoxData}
					/>
			</>
			: null;
	};

	const renderContextMenu = () => {
		return contextMenuData != null
			? <ContextMenu {...contextMenuData} items={contextMenuItems} setContextMenuData={setContextMenuData} />
			: null;
	};

	const renderConnectionBuilder = () => {
		const coords = getConnectionBuilderCoords(connectorAnchor);

		if (!coords) return;

		return <Connector
			coordsStart={coords.start}
			coordsEnd={coords.end}
			roundCorner={true}
			endArrow={true}
			stroke="white"
			strokeWidth={2}
			workArea={workArea}
			/>;
	};

	const renderMarquee = () => {
		return (dragCoords.isDragging && dragCoords.what == 'marquee')
			? <Marquee dragCoords={dragCoords} />
			: null;
	};

	const renderView = () => {
		if (Object.values(panels).length === 0 || Object.values(panelCoords).length === 0) return <></>;

		const [panelsToRender, connectionsToRender] = getVisibleObjects(panels, connections, screenSize);

		return <>
			{panelsToRender.map((panelId) => renderPanel(panels[panelId], panelCoords[panelId]))}
			{connectionsToRender.map(renderConnection)}
		</>;
	};

	return (
		<div
			className="WorkArea"
			ref={workArea}
			style={screenSize}
			onMouseDown={mouseDown}
			onMouseMove={mouseMove}
			onMouseUp={mouseUp}
			onClick={mouseClick}
			onDoubleClick={mouseDoubleClick}
			onContextMenu={contextMenuOpen}
			>
			{renderSearchBox()}
			{renderContextMenu()}
			{renderConnectionBuilder()}
			{renderMarquee()}
			{renderView()}
		</div>
	);
};

export default WorkArea;