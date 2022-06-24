import * as React from 'react';
const { Set } = require('immutable');

import Connector from './Connector/Connector';
import PanelWrapper from './PanelWrapper';
import Marquee from './Marquee';

import { DragCoords } from '../types';

import './WorkArea.css';
import '../Panel/Panel.css';

const WorkArea = (props) => {
	const {
		panels, setPanels,
		connections, setConnections,
		connectorAnchor, setConnectorAnchor,
		makeConnection,
		workAreaOffset, setWorkAreaOffset,
		inclusiveSelection,
		panelIdByInputEndpointId, panelIdByOutputEndpointId
	} = props;

	const getEndpointElById = (id: number): HTMLDivElement | null => document.querySelector(`div.Endpoint[data-id="${id}"]`);

	const getPanelInputRef = (key, ref) => panels[key].inputRefs[ref];
	const getPanelOutputRef = (key, ref) => panels[key].outputRefs[ref];

	const buildScreenSize = () => ({
		top: 0,
		left: 0,
		width: window.innerWidth,
		height: window.innerHeight
	});

	const updatePanel = (key, update) => {
		return setPanels([...panels.slice(0, key), update, ...panels.slice(key + 1)]);
	};

	const workArea = React.useRef<any>();

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords>({ isDragging: false });
	const [ draw, redraw ] = React.useState(0);
	const [ screenSize, setScreenSize ] = React.useState(buildScreenSize());
	const [ selectedPanels, setSelectedPanels ] = React.useState<Set<number>>(Set());

	const [ backupSelectedPanels, setBackupSelectedPanels ] = React.useState<Set<number>>(Set());

	const getPanelInputEndpointIds = (panel) => Object.values(panel.inputRefs);
	const getPanelOutputEndpointIds = (panel) => Object.values(panel.outputRefs);

	const findConnectionByInputEndpointId = (ref) => connections.find((connection) => connection.target === ref);
	const findConnectionByOutputEndpointId = (ref) => connections.find((connection) => connection.source === ref);

	const getConnectionSourceEndpoint = (connection) => connection.source;
	const getConnectionTargetEndpoint = (connection) => connection.target;

	const removeConnectionByOutputRef = (ref) => {
		const connection = findConnectionByOutputEndpointId(ref);

		if (connection) {
			setConnections(connections.filter((connection) => connection.source !== ref));
			return connection;
		}

		return null;
	};

	const removeConnectionByInputRef = (ref) => {
		const connection = findConnectionByInputEndpointId(ref);

		if (connection) {
			setConnections(connections.filter((connection) => connection.target !== ref));
			return connection;
		}

		return null;
	};

	const mouseDown = (e) => {
		e.preventDefault();

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
			const panelKey = parseInt(panel.dataset.key);

			setDragCoords({
				isDragging: true,
				what: 'panel',
				el: panel,
				o: {
					x: Number(e.pageX),
					y: Number(e.pageY)
				},
				c: {
					x: panels[panelKey].left,
					y: panels[panelKey].top
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
			const panel = e.target.closest('.Panel');

			setConnectorAnchor({
				fromRef: null,
				to: null,
				toRef: getPanelInputRef(panel.dataset.key, e.target.dataset.ref),
				from: { x: e.pageX, y: e.pageY }
			});

			return;
		}

		if (creatingOutputConnection) {
			const panel = e.target.closest('.Panel');

			setConnectorAnchor({
				fromRef: getPanelOutputRef(panel.dataset.key, e.target.dataset.ref),
				to: { x: e.pageX, y: e.pageY },
				toRef: null,
				from: null
			});

			return;
		}

		if (detachingInputConnection) {
			const panel = e.target.closest('.Panel');
			const connection = removeConnectionByInputRef(getPanelInputRef(panel.dataset.key, e.target.dataset.ref));
			if (connection == null) return;

			setConnectorAnchor({
				fromRef: connection.source,
				to: { x: e.pageX, y: e.pageY },
				toRef: null,
				from: null
			});
			return;
		}

		if (detachingOutputConnection) {
			const panel = e.target.closest('.Panel');
			const connection = removeConnectionByOutputRef(getPanelOutputRef(panel.dataset.key, e.target.dataset.ref));
			if (connection == null) return;

			setConnectorAnchor({
				fromRef: null,
				to: null,
				toRef: connection.target,
				from: { x: e.pageX, y: e.pageY }
			});
			return;
		}
	};

	const getPanelWorkAreaCoords = (panel) => {
		const left = panel.left + workAreaOffset[0];
		const top = panel.top + workAreaOffset[1];

		return {
			left,
			top,
			right: left + panel.width - 1,
			bottom: top + panel.height - 1
		};
	};

	const selectInclusive = (panels, selection) =>
		panels
			.map((panel) => {
				const panelCoords = getPanelWorkAreaCoords(panel);

				if (panelCoords.right < selection.left) return null;
				if (panelCoords.bottom < selection.top) return null;
				if (panelCoords.left > selection.right) return null;
				if (panelCoords.top > selection.bottom) return null;
				return panel;
			})
			.filter(Boolean);

	const selectExclusive = (panels, selection) =>
		panels
			.map((panel) => {
				const panelCoords = getPanelWorkAreaCoords(panel);

				if (panelCoords.left < selection.Left) return null;
				if (panelCoords.top < selection.top) return null;
				if (panelCoords.right > selection.right) return null;
				if (panelCoords.bottom > selection.bottom) return null;
				return panel;
			})
			.filter(Boolean);

	const linear = (x) => x;
	const snapping = (x) => Math.floor(x / 16) * 16;

	const mouseMove = (e) => {
		if (!dragCoords.isDragging && (connectorAnchor == null)) return;

		if (dragCoords.isDragging && dragCoords.what == 'panel') {
			const panelKey = parseInt(dragCoords.el.dataset.key);
			const func = (props.snap ? snapping : linear);

			updatePanel(panelKey, {
				...panels[panelKey],
				left: func(e.clientX - dragCoords.o.x + dragCoords.c.x),
				top: func(e.clientY - dragCoords.o.y + dragCoords.c.y)
			});

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
		e.preventDefault();

		setDragCoords({ isDragging: false });

		if ((connectorAnchor != null && connectorAnchor.fromRef != null) && e.target.classList.contains('InputEndpoint') && !e.target.classList.contains('Connected')) {
			const panel = e.target.closest('.Panel');

			const toRef = getPanelInputRef(panel.dataset.key, e.target.dataset.ref);

			setConnections([
				...connections,
				makeConnection(connectorAnchor.fromRef, toRef)
			]);
		}

		if ((connectorAnchor != null && connectorAnchor.toRef != null) && (e.target.classList.contains('OutputEndpoint'))) {
			const panel = e.target.closest('.Panel');

			const fromRef = getPanelOutputRef(panel.dataset.key, e.target.dataset.ref);

			setConnections([
				...connections,
				makeConnection(fromRef, connectorAnchor.toRef)
			]);
		}

		setConnectorAnchor(null);
	};

	const mouseClick = (e) => {
		e.stopPropagation();

		if (e.shiftKey) return;
		setSelectedPanels(Set());
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
				workAreaOffset={workAreaOffset}
				connections={connections}
				connectorAnchor={connectorAnchor}
				isSelected={isSelected}
				onSelect={(e) => {
					e.stopPropagation();

					if (!e.shiftKey) return;

					const panel = e.target.closest('.Panel');
					const panelId = parseInt(panel.dataset.key);

					if (!e.ctrlKey) {
						setSelectedPanels(Set([panelId]));
					} else {
						toggleSelection(panelId);
					}
				}}
				/>
		);
	};

	const renderConnection = (connection, key) => {
		return (<Connector
			key={key}
			draw={draw}
			el1={getEndpointElById(connection.source)}
			el2={getEndpointElById(connection.target)}
			roundCorner={true}
			endArrow={true}
			stroke="#ADA257"
			strokeWidth={2}
			workArea={workArea}
		/>);
	};

	window.addEventListener('resize', () => {
		setScreenSize(buildScreenSize());
	});

	const addConnectedPanels = (viewablePanels, nonViewablePanels, viewablePanelsById) => {
		if (nonViewablePanels.length == 0) return viewablePanels;

		const contacting =
			nonViewablePanels
				.map((nvPanel) => getPanelOutputEndpointIds(nvPanel).map((endpointId) => [nvPanel, endpointId]))
				.flat()
				.map(([nvPanel, endpointId]) => {
					const connection = findConnectionByOutputEndpointId(endpointId);
					return connection ? [nvPanel, connection] : null
				})
				.filter(Boolean)
				.map(([nvPanel, connection]) => [nvPanel, connection?.target || null])
				.filter(Boolean)
				.map(([nvPanel, inputEndpointId]) => (inputEndpointId !== null) ? [nvPanel, panelIdByInputEndpointId[inputEndpointId]] : null)
				.filter(Boolean)
				.filter(([nvPanel, panelId]) => panelId !== null && viewablePanelsById[panelId] !== undefined)
				.map(([nvPanel]) => nvPanel)
				.filter(Boolean);

		const contacted =
			nonViewablePanels
				.map((nvPanel) => getPanelInputEndpointIds(nvPanel).map((endpointId) => [nvPanel, endpointId]))
				.flat()
				.map(([nvPanel, endpointId]) => {
					const connection = findConnectionByInputEndpointId(endpointId);
					return connection ? [nvPanel, connection] : null
				})
				.filter(Boolean)
				.map(([nvPanel, connection]) => [nvPanel, connection?.source || null])
				.filter(Boolean)
				.map(([nvPanel, outputEndpointId]) => (outputEndpointId !== null) ? [nvPanel, panelIdByOutputEndpointId[outputEndpointId]] : null)
				.filter(Boolean)
				.filter(([nvPanel, panelId]) => panelId !== null && viewablePanelsById[panelId] !== undefined)
				.map(([nvPanel]) => nvPanel)
				.filter(Boolean);

		return Set([...viewablePanels, ...contacting, ...contacted]).toArray();
	};

	const renderView = () => {
		if (!workArea.current) return <>
			{panels.map(renderPanel)}
			{connections.map(renderConnection)}
		</>;

		const viewport = {
			left: 0,
			top: 0,
			right: screenSize.width - 1,
			bottom: screenSize.height - 1
		};

		const viewablePanels = selectInclusive(panels, viewport);
		const viewableIds = viewablePanels.map((panel) => panel.panelId);

		const viewablePanelsById = {};
		viewablePanels.forEach((panel) => {
			viewablePanelsById[panel.panelId] = panel;
		});

		const nonViewablePanels = panels.filter((panel) => !viewablePanelsById[panel.panelId]);
		const toRender = addConnectedPanels(viewablePanels, nonViewablePanels, viewablePanelsById);

		return <>
			{toRender.map(renderPanel)}
			{connections.map(renderConnection)}
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
			>
			<Connector
				draw={draw}
				el1={(connectorAnchor != null && connectorAnchor.fromRef != null) ? getEndpointElById(connectorAnchor.fromRef) : undefined}
				el2={(connectorAnchor != null && connectorAnchor.toRef != null) ? getEndpointElById(connectorAnchor.toRef) : undefined}
				coordsStart={(connectorAnchor != null && connectorAnchor.toRef != null) ? connectorAnchor.from : undefined}
				coordsEnd={(connectorAnchor != null && connectorAnchor.fromRef != null) ? connectorAnchor.to : undefined}
				roundCorner={true}
				endArrow={true}
				stroke="white"
				strokeWidth={2}
				workArea={workArea}
				/>
			{
				(dragCoords.isDragging && dragCoords.what == 'marquee')
					? <Marquee dragCoords={dragCoords} toolbar={props.toolbar} />
					: null
			}
			{renderView()}
		</div>
	);
};

export default WorkArea;