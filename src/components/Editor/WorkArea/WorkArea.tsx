import * as React from 'react';
import { Set } from 'immutable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import Connector from './Connector/Connector';
import PanelWrapper from './PanelWrapper';
import Marquee from './Marquee';

import ContextMenu from '../ContextMenu/ContextMenu';

import { contextMenusSetup } from '../../../domain/Menus';

import { DragCoords } from '../../../types/DragCoords';

import {
	buildScreenSize,
	getSelectorsFor,
	linear,
	snapping
} from '../../../utils/measures';

import './WorkArea.css';
import '../Panel/Panel.css';

const WorkArea = (props) => {
	const {
		machine,
		play, pause,
		panels, setPanels,
		connections, setConnections,
		focused, setFocus,
		connectorAnchor, setConnectorAnchor,
		makeConnection,
		workAreaOffset, setWorkAreaOffset,
		inclusiveSelection
	} = props;

	const { selectInclusive, selectExclusive } = getSelectorsFor(workAreaOffset);

	const getEndpointElById = (id: number): HTMLDivElement | null => document.querySelector(`div.Endpoint[data-id="${id}"]`);

	const getPanelInputRef = (panelId, ref) => panels[panelId].inputRefs[ref];
	const getPanelOutputRef = (panelId, ref) => panels[panelId].outputRefs[ref];

	const workArea = React.useRef<any>();

	const [ contextMenuData, setContextMenuData ] = React.useState<object | null>(null);

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords>({ isDragging: false });
	const [ draw, redraw ] = React.useState(0);
	const [ screenSize, setScreenSize ] = React.useState(buildScreenSize());
	const [ selectedPanels, setSelectedPanels ] = React.useState<Set<number>>(Set());

	const [ backupSelectedPanels, setBackupSelectedPanels ] = React.useState<Set<number>>(Set());
	const [ resizeTimeoutHandler, setResizeTimeoutHandler ] = React.useState<NodeJS.Timeout | null>(null);

	const contextMenuItems = contextMenusSetup({
		deletePanel: (ctx) => (e) => {
			machine.removeConnectionsByPanelId(ctx.panelId);

			setPanels((panels) => {
				const newPanels = { ...panels };
				delete newPanels[ctx.panelId];

				return newPanels;
			});

			console.log('delete panel ' + ctx.panelId);
		}
	});

	const mouseDown = (e) => {
		if (e.button != 0) return;

		const connected = e.target.classList.contains('Connected');
		const onWorkArea = e.target.classList.contains('WorkArea');

		const draggingPanel = e.target.classList.contains('Panel') || e.target.classList.contains('Title');
		const draggingWorkArea = onWorkArea && !e.shiftKey;
		const selectingArea = onWorkArea && e.shiftKey;
		const creatingInputConnection = e.target.classList.contains('InputEndpoint') && !connected;
		const creatingOutputConnection = e.target.classList.contains('OutputEndpoint') && !connected;
		const detachingInputConnection = (connectorAnchor == null) && e.target.classList.contains('InputEndpoint') && connected;
		const detachingOutputConnection = (connectorAnchor == null) && e.target.classList.contains('OutputEndpoint') && connected;

		if (
			!draggingPanel &&
			!draggingWorkArea &&
			!selectingArea &&
			!creatingInputConnection &&
			!creatingOutputConnection &&
			!detachingInputConnection &&
			!detachingOutputConnection
		) return;

		if (draggingPanel) {
			const panel = e.target.closest('.Panel');
			const panelId = parseInt(panel.dataset.key);

			if ((selectedPanels.size > 0) && selectedPanels.contains(panelId)) {
				const selectedPanelsAnchors =
					selectedPanels
						.map((panelId) => panels[panelId])
						.map((panel) => ({
							panelId: panel.panelId,
							o: {
								x: panel.left,
								y: panel.top
							}
						}))
						.toArray();

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
						x: panels[panelId].left,
						y: panels[panelId].top
					}
				});

				return;
			}

			setDragCoords({
				isDragging: true,
				what: 'panel',
				el: panel,
				o: {
					x: Number(e.pageX),
					y: Number(e.pageY)
				},
				c: {
					x: panels[panelId].left,
					y: panels[panelId].top
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
				toRef: getPanelInputRef(toPanelId, e.target.dataset.ref),
				toPanelId,
				from: { x: e.pageX, y: e.pageY }
			});

			return;
		}

		if (creatingOutputConnection) {
			const fromPanel = e.target.closest('.Panel');
			const fromPanelId = parseInt(fromPanel.dataset.key);

			setConnectorAnchor({
				fromRef: getPanelOutputRef(fromPanelId, e.target.dataset.ref),
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

			const connection = machine.removeConnectionByInputRef(getPanelInputRef(toPanelId, e.target.dataset.ref));
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

		if (detachingOutputConnection) {
			const fromPanel = e.target.closest('.Panel');
			const fromPanelId = parseInt(fromPanel.dataset.key);

			const connection = machine.removeConnectionByOutputRef(getPanelOutputRef(fromPanelId, e.target.dataset.ref));
			if (connection == null) return;

			setConnectorAnchor({
				fromRef: null,
				to: null,
				toRef: connection.target,
				toPanelId: connection.targetPanelId,
				from: { x: e.pageX, y: e.pageY }
			});
			return;
		}
	};

	const mouseMove = (e) => {
		if (e.button != 0) return;

		e.preventDefault();

		if (!dragCoords.isDragging && (connectorAnchor == null)) return;

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
							...panels[v.panelId],
							left: func(v.o.x + distance.dx),
							top: func(v.o.y + distance.dy)
						}
					};
				}, {});

			setPanels((panels) => ({
				...panels,
				...updates
			}));

			return false;
		}

		if (dragCoords.isDragging && dragCoords.what == 'panel') {
			const panelId = parseInt(dragCoords.el.dataset.key);
			const func = (props.snap ? snapping : linear);

			setPanels((panels) => ({
				...panels,
				[panelId]: {
					...panels[panelId],
					left: func(e.clientX - dragCoords.o.x + dragCoords.c.x),
					top: func(e.clientY - dragCoords.o.y + dragCoords.c.y)
				}
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
				(inclusiveSelection ? selectInclusive : selectExclusive)(panels, selection)
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

	const mouseUp = (e) => {
		if (e.button != 0) return;

		e.preventDefault();

		setDragCoords({ isDragging: false });

		if (
			(connectorAnchor != null && connectorAnchor.fromRef != null) &&
			e.target.classList.contains('InputEndpoint') &&
			!e.target.classList.contains('Connected')
		) {
			const toPanel = e.target.closest('.Panel');

			const toPanelId = parseInt(toPanel.dataset.key);
			const toRef = getPanelInputRef(toPanelId, e.target.dataset.ref);

			setConnections([
				...connections,
				makeConnection(connectorAnchor.fromRef, toRef, connectorAnchor.fromPanelId, toPanelId)
			]);
		}

		if ((connectorAnchor != null && connectorAnchor.toRef != null) && (e.target.classList.contains('OutputEndpoint'))) {
			const fromPanel = e.target.closest('.Panel');

			const fromPanelId = parseInt(fromPanel.dataset.key);
			const fromRef = getPanelOutputRef(fromPanelId, e.target.dataset.ref);

			setConnections([
				...connections,
				makeConnection(fromRef, connectorAnchor.toRef, fromPanelId, connectorAnchor.toPanelId)
			]);
		}

		setConnectorAnchor(null);

		redraw(Math.random());
	};

	const mouseClick = (e) => {
		if (e.button != 0) return;

		setContextMenuData(null);
		setFocus(null);

		if (e.shiftKey || e.ctrlKey) {
			console.log(panels);
			return;
		}

		setSelectedPanels(Set());

		return true;
	};

	const contextMenuOpen = (e) => {
		if (e.target.closest('.Panel')) {
			const panelEl = e.target.closest('.Panel');
			const panelId = parseInt(panelEl.dataset.key);

			setContextMenuData({
				left: e.clientX,
				top: e.clientY,
				items: contextMenuItems,
				target: {
					panelId
				}
			});

			return;
		}

		setContextMenuData(null);
		return;
	};

	const toggleSelection = (panelId) => {
		if (selectedPanels.has(panelId)) {
			setSelectedPanels(selectedPanels.delete(panelId));
		} else {
			setSelectedPanels(selectedPanels.add(panelId));
		}
	};

	const renderPanel = (panel) => {
		const isSelected = selectedPanels.has(panel.panelId);

		return (
			<PanelWrapper
				key={panel.panelId}
				panel={panel}
				machine={machine}
				workAreaOffset={workAreaOffset}
				connections={connections}
				connectorAnchor={connectorAnchor}
				isSelected={isSelected}
				onSelect={(e) => {
					e.stopPropagation();

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
				/>
		);
	};

	const renderConnection = (connection, key) => {
		return (<Connector
			key={key}
			el1={getEndpointElById(connection.source)}
			el2={getEndpointElById(connection.target)}
			roundCorner={true}
			endArrow={true}
			stroke={'#ADA257'}
			strokeWidth={2}
			workArea={workArea}
			play={play} pause={pause}
		/>);
	};

	window.addEventListener('resize', () => {
		if (resizeTimeoutHandler !== null) return;

		setResizeTimeoutHandler(setTimeout(() => {
			setScreenSize(buildScreenSize());
			setResizeTimeoutHandler(null);
		}, 100));
	});

	const renderView = (draw) => {
		return <>
			{Object.values(panels).map(renderPanel)}
			{connections.map(renderConnection)}
		</>;
	};

	const renderMarquee = () => {
		return (dragCoords.isDragging && dragCoords.what == 'marquee')
			? <Marquee dragCoords={dragCoords} />
			: null;
	};

	const renderConnectionBuilder = () => {
		return <Connector
			el1={(connectorAnchor != null && connectorAnchor.fromRef != null) ? getEndpointElById(connectorAnchor.fromRef) : undefined}
			el2={(connectorAnchor != null && connectorAnchor.toRef != null) ? getEndpointElById(connectorAnchor.toRef) : undefined}
			coordsStart={(connectorAnchor != null && connectorAnchor.toRef != null) ? connectorAnchor.from : undefined}
			coordsEnd={(connectorAnchor != null && connectorAnchor.fromRef != null) ? connectorAnchor.to : undefined}
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