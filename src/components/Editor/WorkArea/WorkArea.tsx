import * as React from 'react';
import { flushSync } from 'react-dom';
import { Set } from 'immutable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

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

const [searchableItems, searchableItemsIndex] = getIndexFor(dictionary);

const WorkArea = (props) => {
	const {
		machine,
		play, pause,
		graphState,
		focused, setFocus,
		connectorAnchor, setConnectorAnchor,
		workAreaOffset, setWorkAreaOffset,
		inclusiveSelection,
		setShowLightbox,
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

	const [ currentMarker, setCurrentMarker ] = React.useState(-1);
	const [ markers, setMarkers ] = React.useState([]);

	const markerState = {
		workAreaOffset,
		currentMarker, setCurrentMarker,
		markers, setMarkers
	};

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords>({ isDragging: false });
	const [ draw, redraw ] = React.useState<number>(0);
	const [ screenSize, setScreenSize ] = React.useState(buildScreenSize());
	const [ selectedPanels, setSelectedPanels ] = React.useState<Set<number>>(Set());

	const [ backupSelectedPanels, setBackupSelectedPanels ] = React.useState<Set<number>>(Set());

	const [ contextMenuData, setContextMenuData ] = React.useState<object | null>(null);
	const contextMenuItems = getContextMenuItems(machine, contextMenuData, setWorkAreaOffset, setSearchBoxData, setSelectedPanels, markerState);

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

		const draggingPanel = e.target.closest('.Title') && !e.target.closest('.Chevron');
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

		if (!dragCoords.isDragging && connectorAnchor != null && !connectorAnchor.suspended) {
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
				dx: e.clientX - dragCoords.o!.x,
				dy: e.clientY - dragCoords.o!.y
			};

			const panelId = Number(dragCoords.el!.dataset!.key);
			const panel = panels[panelId];
			const panelCoord = panelCoords[panelId];

			const updates = {
				[panelId]: {
					...panelCoord,
					width: Math.max(panelCoord.minWidth, dragCoords.c!.x + distance.dx),
                    height: Math.max(panelCoord.minHeight, dragCoords.c!.y + distance.dy)
				}
			};

			setPanelCoords((panelCoords) => ({
				...panelCoords,
				...updates
			}));

			computeEpCoords(panel, panelCoord, setPanelCoords);

			return false;
		}

		if (dragCoords.what == 'panels') {
			const func = (props.snap ? snapping : linear);

			const distance = {
				dx: e.clientX - dragCoords.o!.x,
				dy: e.clientY - dragCoords.o!.y
			};

			const updates =
				dragCoords.os!.reduce((a, v) => {
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
				e.clientX - dragCoords.o!.x + dragCoords.c!.x,
				e.clientY - dragCoords.o!.y + dragCoords.c!.y
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
				left: Math.min(dragCoords.o!.x, dragCoords.c!.x),
				top: Math.min(dragCoords.o!.y, dragCoords.c!.y),
				right: Math.max(dragCoords.o!.x, dragCoords.c!.x),
				bottom: Math.max(dragCoords.o!.y, dragCoords.c!.y)
			};

			const included =
				(inclusiveSelection ? selectInclusive : selectExclusive)(panels, panelCoords, selection)
					.map((panel) => (panel as { panelId: number }).panelId);

			setSelectedPanels(Set(included).concat(backupSelectedPanels));

			return false;
		}
	};

	const mouseMove = rateLimiter('mouse moved', processMouseMove, mouseMoveEvents, 50);

	const mouseUp = (e) => {
		if (e.button != 0) return;

		setDragCoords({ isDragging: false });

		if (connectorAnchor == null) return;

		// attaching outgoing connector to input endpoint
		if (
			(connectorAnchor.fromRef != null) &&
			e.target.classList.contains('InputEndpoint') &&
			!e.target.classList.contains('Connected')
		) {
			const toPanelEl = e.target.closest('.Panel');

			const toPanelId = parseInt(toPanelEl.dataset.key);
			const toRef = machine.getPanelInputRef(toPanelId, e.target.dataset.name);

			const newConnection = machine.makeConnection(connectorAnchor.fromRef, toRef, connectorAnchor.fromPanelId, toPanelId);

			if (newConnection) {
				flushSync(() => {
					setConnections((connections) => [
						...connections,
						newConnection
					]);
				});
			}

			setConnectorAnchor(null);
		}

		// attaching ingoing connector to output endpoint
		if (
			(connectorAnchor.toRef != null) &&
			e.target.classList.contains('OutputEndpoint')
		) {
			const fromPanelEl = e.target.closest('.Panel');

			const fromPanelId = parseInt(fromPanelEl.dataset.key);
			const fromRef = machine.getPanelOutputRef(fromPanelId, e.target.dataset.name);

			const newConnection = machine.makeConnection(fromRef, connectorAnchor.toRef, fromPanelId, connectorAnchor.toPanelId);

			if (newConnection) {
				flushSync(() => {
					setConnections((connections) => [
						...connections,
						newConnection
					]);
				});
			}

			setConnectorAnchor(null);
		}

		// opening search box from outgoing connector
		if (
			!connectorAnchor.suspended &&
			(connectorAnchor.fromRef != null) &&
			!e.target.classList.contains('InputEndpoint')
		) {
			console.log('selecting input', connectorAnchor);

			setConnectorAnchor({
				...connectorAnchor,
				suspended: true
			});

			const panel = panels[connectorAnchor.fromPanelId];
			const ep = panel.outputEpByRef[connectorAnchor.fromRef];

			setSearchBoxData({
				left: e.clientX,
				top: e.clientY,
				connectorAnchor,
				side: 'input',
				signal: panel.outputSignalByEp[ep],
				type: panel.outputTypeByEp[ep]
			});
		}

		// opening search box from ingoing connector
		if (
			!connectorAnchor.suspended &&
			(connectorAnchor.toRef != null) &&
			!e.target.classList.contains('OutputEndpoint')
		) {
			console.log('selecting output', connectorAnchor);

			setConnectorAnchor({
				...connectorAnchor,
				suspended: true
			});

			const panel = panels[connectorAnchor.toPanelId];
			const ep = panel.inputEpByRef[connectorAnchor.toRef];

			setSearchBoxData({
				left: e.clientX,
				top: e.clientY,
				connectorAnchor,
				side: 'output',
				signal: panel.inputSignalByEp[ep],
				type: panel.inputTypeByEp[ep]
			});
		}

		redraw(Math.random());
	};

	const mouseClick = (e) => {
		if (e.button != 0) return;

		setFocus(null);

		if (e.shiftKey || e.ctrlKey) {
			console.log(panels, panelCoords);
			console.log(connections);
			console.log(selectedPanels);
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

	const mouseWheel = (e) => {
		if (selectedPanels.size == 0) return;

		const inc = e.shiftKey ? 1 : 16;

		const updates =
			selectedPanels.toArray()
				.map((panelId) => panelCoords[panelId])
				.map((panelCoord) => {
					const inward = Math.sign(e.deltaY);

					const incX = e.clientX - workAreaOffset[0] < panelCoord.left ? -inc : 0;
					const decX = e.clientX - workAreaOffset[0] > panelCoord.left + panelCoord.width - 1 ? inc : 0;

					const incY = e.clientY - workAreaOffset[1] < panelCoord.top ? -inc : 0;
					const decY = e.clientY - workAreaOffset[1] > panelCoord.top + panelCoord.height - 1 ? inc : 0;

					return [
						panelCoord.panelId, {
							...panelCoord,
							left: panelCoord.left + inward * (incX + decX),
							top: panelCoord.top + inward * (incY + decY)
						}
					];
				});

		setPanelCoords({
			...panelCoords,
			...Object.fromEntries(updates)
		});
	};

	const contextMenuOpen = getContextMenuOpen(selectedPanels, setContextMenuData, setSearchBoxData, markerState.markers);

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
				setShowLightbox={setShowLightbox}
				computeEpCoords={computeEpCoords}
				onSelect={(e) => {
					e.stopPropagation();
					setSearchBoxData(null);
					setContextMenuData(null);
					setConnectorAnchor(null);

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

	const renderMarker = (marker) => {
		return <div
				style={{
					position: 'absolute',
					color: '#a55',
					left: marker[0] + workAreaOffset[0],
					top: marker[1] + workAreaOffset[1]
				}}
				title={marker[2]}
			>
			<FontAwesomeIcon icon={solid('crosshairs')} />
		</div>;
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
					setConnectorAnchor={setConnectorAnchor}
					machine={machine}
					setConnections={setConnections}
					redraw={redraw}
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
		if ((markerState.markers.length === 0) && (Object.values(panels).length === 0 || Object.values(panelCoords).length === 0)) return <></>;

		const [panelsToRender, connectionsToRender] = getVisibleObjects(panels, connections, screenSize);

		return <>
			{panelsToRender.map((panelId) => renderPanel(panels[panelId], panelCoords[panelId]))}
			{connectionsToRender.map(renderConnection)}
			{markerState.markers.map(renderMarker)}
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
			onWheel={mouseWheel}
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