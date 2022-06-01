import * as React from 'react';
import Connector from '../Connector/Connector';
// import Connector from 'react-svg-connector';

const Editor = () => {
	const makeNode = (type, title) => {
		const inputVolume = React.useRef<any>();
		const inputFrequency = React.useRef<any>();
		const outputAudio = React.useRef<any>();
		
		return { 
			type, 
			title, 
			refs: { inputVolume, inputFrequency, outputAudio }
		};
	};

	const makeEdge = (source, target) => {
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
		nodeKey: string;
		refName: string;
		// virtual: Element;
		to: { 
			x: number; 
			y: number;
		}
	}

	const [ dragCoords, setDragCoords ] = React.useState<DragCoords | null>(null);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
	const [ nodes, setNodes ] = React.useState([makeNode('text', 'Component 1'), makeNode('text', 'Component 2')]);
	const [ edges, setEdges ] = React.useState([makeEdge(nodes[0].refs.outputAudio, nodes[1].refs.inputVolume), makeEdge(nodes[0].refs.outputAudio, nodes[1].refs.inputFrequency)]);
	const [ draw, redraw ] = React.useState(0);
	const [ screenSize, setScreenSize ] = React.useState({ 
		width: window.innerWidth, 
		height: window.innerHeight 
	});

	const virtual = React.useRef<any>();

	const mouseDown = (e) => {
		e.preventDefault();

		const draggingNode = e.target.classList.contains('Node') || e.target.classList.contains('Title');
		const creatingConnector = e.target.classList.contains('OutputHandle');
		
		if (!draggingNode && !creatingConnector) return;

		if (draggingNode) {
			const Node = e.target.closest('.Node');

			setDragCoords({ 
				el: Node,
				ox: Number(e.pageX), 
				oy: Number(e.pageY), 
				cx: parseInt(Node.style.left), 
				cy: parseInt(Node.style.top)
			});

			return;
		}

		if (creatingConnector) {
			const Node = e.target.closest('.Node');

			// const virtual = document.querySelector('.VirtualHandle');

			// virtual.style.left = (e.pageX - virtual.scrollWidth / 2) + 'px';
			// virtual.style.top = (e.pageY - virtual.scrollHeight / 2) + 'px';
			// virtual.classList.add('active');

			setConnectorAnchor({
				nodeKey: Node.dataset.key,
				refName: e.target.dataset.ref,
				to: { x: e.pageX, y: e.pageY }
				// ,			virtual
			});

			return;
		}
	};

	const mouseMove = (e) => {
		console.log('x');
		if ((dragCoords == null) && (connectorAnchor == null)) return;

		if (dragCoords != null) {
			dragCoords.el.style.left = e.clientX - dragCoords.ox + dragCoords.cx + 'px';
			dragCoords.el.style.top = e.clientY - dragCoords.oy + dragCoords.cy + 'px';
			redraw(Math.random());

			return false;
		}

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
		setConnectorAnchor(null);
		// connectorAnchor?.virtual?.classList.remove('active');
	};

	const renderNode = (node, key) => {
		return (
			<div key={key} data-key={key} className="Node" style={{ left: '100px', top: '100px' }}> 
				<div className="Title">{node.title}</div>
				<div className="Row">
					<div className="Input Item"><div className="InputHandle" ref={node.refs.inputVolume} data-ref="inputVolume"></div>Volume</div>
					<div className="Output Item">Sound<div className="OutputHandle" ref={node.refs.outputAudio} data-ref="outputAudio"></div></div>
				</div>
				<div className="Row">
					<div className="Input Item"><div className="InputHandle" ref={node.refs.inputFrequency} data-ref="inputFrequency"></div>Frequency</div>
				</div>
				<div className="Row">
					<div className="Input Item"><input type="text" /></div>
				</div>
			</div>
		);
	};

	const renderEdge = (edge, key) => {
		return (<Connector
			key={key}
			x={draw}
			el1={edge.source.current}
			el2={edge.target.current}
			roundCorner={true}
			endArrow={true}
			stroke="white"
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
				el1={(connectorAnchor != null) ? nodes[connectorAnchor.nodeKey].refs[connectorAnchor.refName].current : undefined}
				coordsEnd={(connectorAnchor != null) ? connectorAnchor.to : undefined}
				roundCorner={true}
				endArrow={true}
				stroke="white"
				strokeWidth={2}
				/>		
			{nodes.map(renderNode)}
			{edges.map(renderEdge)}
		</div>
	);
};

export default Editor;