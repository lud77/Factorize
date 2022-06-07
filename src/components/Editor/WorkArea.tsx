import * as React from 'react';
import { transform } from 'typescript';
import Connector from '../Connector/Connector';
import InputEndpointFactory from './InputEndpoint';
import OutputEndpointFactory from './OutputEndpoint';

const WorkArea = (props) => {
	const makePanel = (type, title) => {
		const inputVolume = React.useRef<any>();
		const inputFrequency = React.useRef<any>();
		const outputAudio = React.useRef<any>();
		const outputWhatev = React.useRef<any>();
		
		return { 
			type, 
			title, 
			refs: { inputVolume, inputFrequency, outputAudio, outputWhatev }
		};
	};

	const makeConnection = (source, target) => {
		return { 
			source, 
			target 
		};
	};

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

	const buildScreenSize = () => ({
		top: props.toolbar.height,
		left: 0,
		width: window.innerWidth, 
		height: window.innerHeight
	});

	const workArea = React.useRef<any>();

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords | null>(null);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
	const [ panels, setPanels ] = React.useState([makePanel('text', 'Component 1'), makePanel('text', 'Component 2')]);
	const [ connections, setConnections ] = React.useState([makeConnection(panels[0].refs.outputAudio, panels[1].refs.inputVolume)]);
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

	const mouseMove = (e) => {
		if ((dragCoords == null) && (connectorAnchor == null)) return;

		if (dragCoords != null) {
			dragCoords.el.style.left = e.clientX - dragCoords.o.x + dragCoords.c.x + 'px';
			dragCoords.el.style.top = e.clientY - dragCoords.o.y + dragCoords.c.y + 'px';
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

	const renderPanel = (panel, key) => {
		return (
			<div key={key} data-key={key} className="Panel" style={{ left: '100px', top: '100px' }}> 
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
			x={draw}
			el1={connection.source.current}
			el2={connection.target.current}
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
			onMouseMove={mouseMove} 
			onMouseUp={mouseUp} 
			onMouseDown={mouseDown} 
			style={screenSize}
			>
			<Connector
				x={draw}
				el1={(connectorAnchor != null && connectorAnchor.fromRef != null) ? connectorAnchor.fromRef.current : undefined}
				el2={(connectorAnchor != null && connectorAnchor.toRef != null) ? connectorAnchor.toRef.current : undefined}
				coordsStart={(connectorAnchor != null && connectorAnchor.toRef != null) ? connectorAnchor.from : undefined}
				coordsEnd={(connectorAnchor != null && connectorAnchor.fromRef != null) ? connectorAnchor.to : undefined}
				roundCorner={true}
				endArrow={true}
				stroke="white"
				strokeWidth={2}
				workArea={workArea}
				/>		
			{panels.map(renderPanel)}
			{connections.map(renderConnection)}
		</div>
	);
};

export default WorkArea;