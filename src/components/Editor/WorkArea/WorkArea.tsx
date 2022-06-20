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
		marquee, setMarquee,
		panels, setPanels,
		connections, setConnections,
		connectorAnchor, setConnectorAnchor,
		makeConnection,
		workAreaOffset, setWorkAreaOffset
	} = props;

	const getEndpointElById = (id: number): HTMLDivElement | null => document.querySelector(`div.Endpoint[data-id="${id}"]`);

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

	const removeConnectionByOutputRef = (ref) => {
		const connection = connections.find((connection) => connection.source === ref);

		if (connection) {
			setConnections(connections.filter((connection) => connection.source !== ref));
			return connection;
		}

		return null;
	};

	const removeConnectionByInputRef = (ref) => {
		const connection = connections.find((connection) => connection.target === ref);

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
					x: panels[panelKey].x,
					y: panels[panelKey].y
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
					x: 0,
					y: 0
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
				toRef: panels[panel.dataset.key].refs[e.target.dataset.ref],
				from: { x: e.pageX, y: e.pageY }
			});

			return;
		}

		if (creatingOutputConnection) {
			const panel = e.target.closest('.Panel');

			setConnectorAnchor({
				fromRef: panels[panel.dataset.key].refs[e.target.dataset.ref],
				to: { x: e.pageX, y: e.pageY },
				toRef: null,
				from: null
			});

			return;
		}

		if (detachingInputConnection) {
			const panel = e.target.closest('.Panel');
			const connection = removeConnectionByInputRef(panels[panel.dataset.key].refs[e.target.dataset.ref]);
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
			const connection = removeConnectionByOutputRef(panels[panel.dataset.key].refs[e.target.dataset.ref]);
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

	const linear = (x) => x;
	const snapping = (x) => Math.floor(x / 16) * 16;

	const mouseMove = (e) => {
		if (!dragCoords.isDragging && (connectorAnchor == null)) return;

		if (dragCoords.isDragging && dragCoords.what == 'panel') {
			const panelKey = parseInt(dragCoords.el.dataset.key);
			const func = (props.snap ? snapping : linear);

			updatePanel(panelKey, {
				...panels[panelKey],
				x: func(e.clientX - dragCoords.o.x + dragCoords.c.x),
				y: func(e.clientY - dragCoords.o.y + dragCoords.c.y)
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

			const included =
				panels
					.map((panel, ind) => {
						const absoluteX = panel.x + workAreaOffset[0];
						const absoluteY = panel.y + workAreaOffset[1];

						if (absoluteX < dragCoords.o?.x) return -1;
						if (absoluteY < dragCoords.o?.y) return -1;
						if (absoluteX > marqueeRight) return -1;
						if (absoluteY > marqueeBottom) return -1;
						return ind;
					})
					.filter((ind) => ind != -1);

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

			const toRef = panels[panel.dataset.key].refs[e.target.dataset.ref];

			setConnections([
				...connections,
				makeConnection(connectorAnchor.fromRef, toRef)
			]);
		}

		if ((connectorAnchor != null && connectorAnchor.toRef != null) && (e.target.classList.contains('OutputEndpoint'))) {
			const panel = e.target.closest('.Panel');

			const fromRef = panels[panel.dataset.key].refs[e.target.dataset.ref];

			setConnections([
				...connections,
				makeConnection(fromRef, connectorAnchor.toRef)
			]);
		}

		setConnectorAnchor(null);
	};

	const mouseClick = () => {
		setSelectedPanels(Set());
	};

	const toggleSelection = (ind) => {
		if (selectedPanels.has(ind)) {
			setSelectedPanels(selectedPanels.delete(ind));
		} else {
			setSelectedPanels(selectedPanels.add(ind));
		}
	};

	const renderPanel = (panel, ind) => {
		const isSelected = selectedPanels.has(ind);

		return (
			<PanelWrapper
				key={ind}
				ind={ind}
				panel={panel}
				workAreaOffset={workAreaOffset}
				connections={connections}
				connectorAnchor={connectorAnchor}
				isSelected={isSelected}
				onSelect={(e) => {
					e.stopPropagation();

					if (!e.shiftKey) return;

					const panel = e.target.closest('.Panel');
					const ind = parseInt(panel.dataset.key);

					if (!e.ctrlKey) {
						setSelectedPanels(Set([ind]));
					} else {
						setSelectedPanels(selectedPanels.add(ind));
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
			{props.panels.map(renderPanel)}
			{props.connections.map(renderConnection)}
		</div>
	);
};

export default WorkArea;