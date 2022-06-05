import * as React from 'react';
import Connector from '../Connector/Connector';
import InputEndpointFactory from './InputEndpoint';
import OutputEndpointFactory from './OutputEndpoint';

const Editor = () => {
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

	interface DragCoords {
		el: Element;
		ox: number;
		oy: number;
		cx: number;
		cy: number;
	}

	interface ConnectorAnchor {
		fromRef: Element;
		to: { 
			x: number; 
			y: number;
		}
	}

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords | null>(null);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
	const [ panels, setPanels ] = React.useState([makePanel('text', 'Component 1'), makePanel('text', 'Component 2')]);
	const [ connections, setConnections ] = React.useState([makeConnection(panels[0].refs.outputAudio, panels[1].refs.inputVolume)]);
	const [ draw, redraw ] = React.useState(0);
	const [ screenSize, setScreenSize ] = React.useState({ 
		width: window.innerWidth, 
		height: window.innerHeight 
	});

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
		const creatingConnection = e.target.classList.contains('OutputEndpoint') && !connected;
		const detachingConnection = (connectorAnchor == null) && e.target.classList.contains('InputEndpoint') && connected;

		if (!draggingPanel && !creatingConnection && !detachingConnection) return;

		if (draggingPanel) {
			const panel = e.target.closest('.Panel');

			setDragCoords({ 
				el: panel,
				ox: Number(e.pageX), 
				oy: Number(e.pageY), 
				cx: parseInt(panel.style.left), 
				cy: parseInt(panel.style.top)
			});

			return;
		}

		if (creatingConnection) {
			const panel = e.target.closest('.Panel');

			setConnectorAnchor({
				fromRef: panels[panel.dataset.key].refs[e.target.dataset.ref],
				to: { x: e.pageX, y: e.pageY }
			});
			
			return;
		}

		if (detachingConnection) {
			const panel = e.target.closest('.Panel');
			const connection = removeConnectionByInputRef(panels[panel.dataset.key].refs[e.target.dataset.ref]);
			if (connection == null) return;
			
			setConnectorAnchor({
				fromRef: connection.source,
				to: { x: e.pageX, y: e.pageY }
			});
			return;
		}
	};

	const mouseMove = (e) => {
		if ((dragCoords == null) && (connectorAnchor == null)) return;

		if (dragCoords != null) {
			dragCoords.el.style.left = e.clientX - dragCoords.ox + dragCoords.cx + 'px';
			dragCoords.el.style.top = e.clientY - dragCoords.oy + dragCoords.cy + 'px';
			redraw(Math.random());

			return false;
		}

		console.log('mouseMove', connectorAnchor);

		if (connectorAnchor != null) {
			setConnectorAnchor({
				...connectorAnchor,
				to: { x: e.clientX, y: e.clientY }
			});
		}
	};

	const mouseUp = (e) => {
		e.preventDefault();

		setDragCoords(null);

		if ((connectorAnchor != null) && (e.target.classList.contains('InputEndpoint'))) {
			const panel = e.target.closest('.Panel');

			const toRef = panels[panel.dataset.key].refs[e.target.dataset.ref];
	
			setConnections([
				...connections,
				makeConnection(connectorAnchor.fromRef, toRef)
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
		/>);
	};

	window.addEventListener('resize', () => {
		setScreenSize({ 
			window: window.innerWidth, 
			height: window.innerHeight
		});
	});

	return (
		<div 
			className="Editor" 
			onMouseMove={mouseMove} 
			onMouseUp={mouseUp} 
			onMouseDown={mouseDown} 
			style={screenSize}
			>
			<Connector
				x={draw}
				el1={(connectorAnchor != null) ? connectorAnchor.fromRef.current : undefined}
				coordsEnd={(connectorAnchor != null) ? connectorAnchor.to : undefined}
				roundCorner={true}
				endArrow={true}
				stroke="white"
				strokeWidth={2}
				/>		
			{panels.map(renderPanel)}
			{connections.map(renderConnection)}
		</div>
	);
};

export default Editor;