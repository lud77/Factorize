import * as React from 'react';
import { flushSync } from 'react-dom';
import { Set } from 'immutable';

import Connector from './Connector/Connector';
import PanelWrapper from '../Panel/PanelWrapper';
import Marquee from './Marquee';

import ContextMenu from '../ContextMenu/ContextMenu';

import {
	buildScreenSize,
	getSelectorsFor,
	linear,
	snapping,
	middleRight,
	middleLeft,
	middleRightEl,
	middleLeftEl,
	getEndpointElByRef,
	overlapsArea
} from '../../../domain/Measures';

import { contextMenusSetup } from '../../../domain/Menus';
import rateLimiter from '../../../utils/rateLimiter';
import { DragCoords } from '../../../types/DragCoords';

import './WorkArea.css';
import '../Panel/Panel.css';

let resizeEvents: number[] = [];
let mouseMoveEvents: number[] = [];

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

	const { selectInclusive, selectExclusive } = getSelectorsFor(workAreaOffset);

	const workArea = React.useRef<any>();

	const [ contextMenuData, setContextMenuData ] = React.useState<object | null>(null);

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords>({ isDragging: false });
	const [ draw, redraw ] = React.useState(0);
	const [ screenSize, setScreenSize ] = React.useState(buildScreenSize());
	const [ selectedPanels, setSelectedPanels ] = React.useState<Set<number>>(Set());

	const [ backupSelectedPanels, setBackupSelectedPanels ] = React.useState<Set<number>>(Set());

	const contextMenuItems = contextMenusSetup({
		deletePanel: (target) => (e) => {
			machine.removePanelsByIds([target.panelId]);
		},
		deletePanels: (target) => (e) => {
			machine.removePanelsByIds(target.selectedPanels);
		},
		groupPanels: (target) => (e) => {
			machine.groupPanelsByIds(target.selectedPanels);
		},
		ungroupPanel: (target) => (e) => {
			machine.ungroupPanelById(target.panelId);
		},
		ungroupPanels: (target) => (e) => {
			machine.ungroupPanelsByIds(target.selectedPanels);
		},
		removeEp: (target) => (e) => {
			if (target.endpoint.type === 'Input') return machine.removeInputEndpoint(target.panelId, target.endpoint.name, target.endpoint.ref, target.endpoint.registry);
			if (target.endpoint.type === 'Output') return machine.removeOutputEndpoint(target.panelId, target.endpoint.name, target.endpoint.ref, target.endpoint.registry);
		},
		duplicatePanel: (target) => (e) => {
			machine.duplicatePanelById(target.panelId);
		},
		disconnectPanel: (target) => (e) => {
			machine.removeConnectionsByPanelId(target.panelId);
		},
		findOrigin: () => (e) => {
			setWorkAreaOffset([0, 0]);
		}
	});

	const getPanelIdsToMove = (contactPanelId) => {
		console.log('contactPanelId', contactPanelId);

		let panelIds = ((selectedPanels.size > 0) && selectedPanels.contains(contactPanelId)) ? Array.from(selectedPanels) : [contactPanelId];

		console.log('panelIds', panelIds);

		return panelIds
			.map((panelId) => panelCoords[panelId])
			.map((panelCoord) => panelCoord.group ? Array.from(panelCoord.group) : [])
			.flat()
			.concat(panelIds);
	};

	const getAnchorsPointsFor = (panelIds) => {
		return panelIds
			.map((panelId) => panelCoords[panelId])
			.map((panelCoord) => ({
				panelId: panelCoord.panelId,
				o: {
					x: panelCoord.left,
					y: panelCoord.top
				}
			}));
	};

	const mouseDown = (e) => {
		if (e.button != 0) return;

		if (contextMenuData != null) {
			if (e.target.closest('.ContextMenu')) return;

			setContextMenuData(null);
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

		if (!dragCoords.isDragging && (connectorAnchor == null)) return;

		console.log('mouse move', dragCoords.what);

		if (dragCoords.isDragging && dragCoords.what == 'panel-resizer') {
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

			console.log('panel-resizer', );

			setPanelCoords((panelCoords) => ({
				...panelCoords,
				...updates
			}));

			return false;
		}

		if (dragCoords.isDragging && dragCoords.what == 'panels') {
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

		if (dragCoords.isDragging && dragCoords.what == 'workarea') {
			setWorkAreaOffset([
				e.clientX - dragCoords.o.x + dragCoords.c.x,
				e.clientY - dragCoords.o.y + dragCoords.c.y
			]);

			return false;
		}

		if (dragCoords.isDragging && dragCoords.what == 'marquee') {
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

		if (connectorAnchor != null && connectorAnchor.fromRef != null) {
			setConnectorAnchor({
				...connectorAnchor,
				to: { x: e.clientX, y: e.clientY }
			});
		}

		if (connectorAnchor != null && connectorAnchor.toRef != null) {
			setConnectorAnchor({
				...connectorAnchor,
				from: { x: e.clientX, y: e.clientY }
			});
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

	const contextMenuOpen = (e) => {
		if (e.target.closest('.Panel')) {
			const panelEl = e.target.closest('.Panel');
			const panelId = parseInt(panelEl.dataset.key);
			const isSelection = selectedPanels.includes(panelId);

			const row = e.target.closest('.Row');

			let ep = null;
			if (row) {
				const res = row.getElementsByClassName('Endpoint');
				ep = (res != null) ? res[0] : null;
			}

			const removableEndpoint = (ep != null) && ep.classList.contains('Removable');

			const tags = [isSelection ? 'panels' : 'panel'];
			const target = { panelId, selectedPanels };

			if (removableEndpoint) {
				tags.push('removable endpoint');
				target.endpoint = ep.dataset;
			}

			setContextMenuData({
				left: e.clientX,
				top: e.clientY,
				items: contextMenuItems,
				target,
				tags
			});

			return;
		}

		if (e.target.closest('.ContextMenu')) {
			setContextMenuData(null);
			return;
		}

		setContextMenuData({
			left: e.clientX,
			top: e.clientY,
			items: contextMenuItems,
			target: e.target,
			tags: ['workarea']
		});

		return;
	};

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

	const getPanelBoundingBox = (panelId) => {
		const panelCoord = panelCoords[panelId];

		return {
			left: workAreaOffset[0] + panelCoord.left,
			top: workAreaOffset[1] + panelCoord.top,
			right: workAreaOffset[0] + panelCoord.left + (panelCoord.isCollapsed ? 120 : panelCoord.width) - 1,
			bottom: workAreaOffset[1] + panelCoord.top + (panelCoord.isCollapsed ? 22 : panelCoord.height) - 1,
		};
	};

	const getConnectionBoundingBox = (connection) => {
		const s = getStartConnectionCoords(connection);
		const t = getEndConnectionCoords(connection);

		return {
			left: Math.min(s.x, t.x) - 30,
			top: Math.min(s.y, t.y),
			right: Math.max(s.x, t.x) + 30,
			bottom: Math.max(s.y, t.y)
		};
	};

	const renderPanel = (panel, panelCoord) => {
		const isFocused = focused === panel.panelId;
		const isSelected = selectedPanels.has(panel.panelId);

		return (
			<PanelWrapper
				key={panel.panelId}
				setPanelCoords={setPanelCoords} panel={panel} panelCoord={panelCoord}
				machine={machine}
				workAreaOffset={workAreaOffset}
				connections={connections}
				connectorAnchor={connectorAnchor}
				isFocused={isFocused}
				isSelected={isSelected}
				onSelect={(e) => {
					e.stopPropagation();
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

	const getStartConnectionCoords = (connection) => {
		const panelCoord = panelCoords[connection.sourcePanelId];

		if (panelCoord.isCollapsed) return middleRight({
			right: panelCoord.left + workAreaOffset[0] + 120 - 1,
			top: panelCoord.top + workAreaOffset[1],
			height: 22
		});

		const epCoords = panelCoord.epCoords[connection.source];
		return {
			x: epCoords.x + panelCoord.left + workAreaOffset[0],
			y: epCoords.y + panelCoord.top + workAreaOffset[1]
		};
	};

	const getEndConnectionCoords = (connection) => {
		const panelCoord = panelCoords[connection.targetPanelId];

		if (panelCoord.isCollapsed) return middleLeft({
			left: panelCoord.left + workAreaOffset[0],
			top: panelCoord.top + workAreaOffset[1],
			height: 22
		});

		const epCoords = panelCoord.epCoords[connection.target];
		return {
			x: epCoords.x + panelCoord.left + workAreaOffset[0],
			y: epCoords.y + panelCoord.top + workAreaOffset[1]
		};
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

	const renderView = (draw) => {
		if (Object.values(panels).length === 0 || Object.values(panelCoords).length === 0) return <></>;

		const isInView = overlapsArea(screenSize);

		const panelsToRender =
			Object.keys(panels)
				.map((panelId) => {
					const boundingBox = getPanelBoundingBox(panelId);

					if (isInView(boundingBox)) return panelId;
					return null;
				})
				.filter(Boolean);

		const connectionsToRender =
			connections
				.map((connection) => {
					const boundingBox = getConnectionBoundingBox(connection);

					if (isInView(boundingBox)) return connection;
					return null;
				})
				.filter(Boolean);

		return <>
			{panelsToRender.map((panelId) => renderPanel(panels[panelId], panelCoords[panelId]))}
			{connectionsToRender.map(renderConnection)}
		</>;
	};

	const renderMarquee = () => {
		return (dragCoords.isDragging && dragCoords.what == 'marquee')
			? <Marquee dragCoords={dragCoords} />
			: null;
	};

	const getConnectionBuilderCoords = () => {
		if ((connectorAnchor != null && connectorAnchor.fromRef != null)) return {
			start: middleRightEl(getEndpointElByRef(connectorAnchor.fromRef)),
			end: connectorAnchor.to
		};

		if ((connectorAnchor != null && connectorAnchor.toRef != null)) return {
			start: connectorAnchor.from,
			end: middleLeftEl(getEndpointElByRef(connectorAnchor.toRef))
		};

		return null;
	};

	const renderConnectionBuilder = () => {
		const coords = getConnectionBuilderCoords();
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

	return (
		<div
			className="WorkArea"
			ref={workArea}
			style={screenSize}
			onMouseDown={mouseDown}
			onMouseMove={mouseMove}
			onMouseUp={mouseUp}
			onClick={mouseClick}
			onContextMenu={contextMenuOpen}
			>
			{contextMenuData != null ? <ContextMenu {...contextMenuData} setContextMenuData={setContextMenuData} /> : null}
			{renderConnectionBuilder()}
			{renderMarquee()}
			{renderView(draw)}
		</div>
	);
};

export default WorkArea;