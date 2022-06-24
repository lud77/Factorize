import * as React from 'react';

export default (props) => {
	const isInputConnected = (ref) => props.connections.find((connection) => connection.target === ref);

    const onMouseOver = (e) => {
        if (props.connectorAnchor == null) return;
        if (e.target.classList.contains('Connected')) return;

        e.target.classList.add('Hovering');
    };

    const onMouseOut = (e) => {
		if (props.connectorAnchor == null) return;

        e.target.classList.remove('Hovering');
    };

    return <div className="Input Item">
        <div
            className={`InputEndpoint Endpoint ${isInputConnected(props.panel.inputRefs[`input${props.name}`]) ? 'Connected' : ''}`}
            data-id={props.panel.inputRefs[`input${props.name}`]}
            data-ref={`input${props.name}`}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            ></div>
        {props.children}
    </div>;
};