import * as React from 'react';
import { transform } from 'typescript';

import Connector from './Connector/Connector';
import InputEndpointFactory from './InputEndpoint';
import OutputEndpointFactory from './OutputEndpoint';

import './WorkArea.css';
import './Panel.css';

const WorkArea = (props) => {
	interface Point {
		x: number; 
		y: number;
	}

	interface DragCoords {
		el: Element;
		o: Point;
		c: Point;
	}

	interface ConnectorAnchor {
		fromRef: Element;
		toRef: Element;
		to: Point;
		from: Point;
	}

	const { 
		panels, setPanels, 
		connections, setConnections,
		makeConnection
	} = props;

	const getEndpointElById = (id: number): HTMLDivElement | null => document.querySelector(`div.Endpoint[data-id="${id}"]`);

	const buildScreenSize = () => ({
		top: props.toolbar.height,
		left: 0,
		width: window.innerWidth, 
		height: window.innerHeight
	});

	const workArea = React.useRef<any>();

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords | null>(null);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
	const [ draw, redraw ] = React.useState(0);
	const [ screenSize, setScreenSize ] = React.useState(buildScreenSize());

	const virtual = React.useRef<any>();

	const isOutputConnected = (ref) => connections.find((connection) => connection.source === ref);
	const isInputConnected = (ref) => connections.find((connection) => connection.target === ref);

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

		const draggingPanel = e.target.classList.contains('Panel') || e.target.classList.contains('Title');
		const creatingInputConnection = e.target.classList.contains('InputEndpoint') && !connected;
		const creatingOutputConnection = e.target.classList.contains('OutputEndpoint') && !connected;
		const detachingInputConnection = (connectorAnchor == null) && e.target.classList.contains('InputEndpoint') && connected;
		const detachingOutputConnection = (connectorAnchor == null) && e.target.classList.contains('OutputEndpoint') && connected;

		if (
			!draggingPanel && 
			!creatingInputConnection && 
			!creatingOutputConnection && 
			!detachingInputConnection && 
			!detachingOutputConnection
		) return;

		if (draggingPanel) {
			const panel = e.target.closest('.Panel');

			setDragCoords({ 
				el: panel,
				o: {
					x: Number(e.pageX), 
					y: Number(e.pageY)
				}, 
				c: { 
					x: parseInt(panel.style.left), 
					y: parseInt(panel.style.top) 
				}
			});

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
		if ((dragCoords == null) && (connectorAnchor == null)) return;

		if (dragCoords != null) {
			const func = (props.snap ? snapping : linear);
			dragCoords.el.style.left = func(e.clientX - dragCoords.o.x + dragCoords.c.x) + 'px';
			dragCoords.el.style.top = func(e.clientY - dragCoords.o.y + dragCoords.c.y) + 'px';
			redraw(Math.random());

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

		setDragCoords(null);

		if ((connectorAnchor != null && connectorAnchor.fromRef != null) && (e.target.classList.contains('InputEndpoint'))) {
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

	const InputEndpoint = InputEndpointFactory(isInputConnected, connectorAnchor);
	const OutputEndpoint = OutputEndpointFactory(isOutputConnected, connectorAnchor);

	let position = 100;

	const renderPanel = (panel, key) => {
		const initialPosition = { left: position + 'px', top: position + 'px' };
		position += 20;

		return (
			<div key={key} data-key={key} className="Panel" style={initialPosition}> 
				<div className="Title">{panel.title}</div>
				<div className="Row">
					<InputEndpoint name="Volume" panel={panel}>Volume</InputEndpoint>
					<OutputEndpoint name="Audio" panel={panel}>Audio</OutputEndpoint>
				</div>
				<div className="Row">
					<InputEndpoint name="Frequency" panel={panel}>Frequency</InputEndpoint>
					<OutputEndpoint name="Whatev" panel={panel}>Whatev</OutputEndpoint>
				</div>
				<div className="Row">
					<div className="Input Item"><input type="text" /></div>
				</div>
			</div>
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
			{props.panels.map(renderPanel)}
			{props.connections.map(renderConnection)}
		</div>
	);
};

export default WorkArea;