import * as React from 'react';

export default (props) => {
    const isOutputConnected = (ref) => props.connections.find((connection) => connection.source === ref);

    return 	<div className="Output Item">
        {props.children}
        <div
            className={`
                OutputEndpoint Endpoint
                ${isOutputConnected(props.panel.outputRefs[`output${props.name}`]) ? 'Connected' : ''}
                ${(props.connectorAnchor != null) && (props.connectorAnchor?.fromRef == props.panel.outputRefs[`output${props.name}`]) ? 'Connecting' : ''}
            `}
            data-id={props.panel.outputRefs[`output${props.name}`]}
            data-ref={`output${props.name}`}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            ></div>
    </div>;
};