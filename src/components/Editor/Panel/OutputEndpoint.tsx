import * as React from 'react';

export default (props) => {
    console.log('output endpoint', props.connections)
    const isOutputConnected = (ref) => props.connections.find((connection) => connection.source === ref);

    return 	<div className="Output Item">
        {props.children}
        <div
            className={`
                OutputEndpoint Endpoint
                ${isOutputConnected(props.panel.outputRefs[`output${props.name}`]) ? 'Connected' : ''}
                ${(props.connectorAnchor != null) && (props.connectorAnchor?.fromRef == props.panel.outputRefs[`output${props.name}`]) ? 'Connecting' : ''}
                ${props.removable ? 'Removable' : ''}
            `}
            data-ref={props.panel.outputRefs[`output${props.name}`]}
            data-name={`output${props.name}`}
            data-registry={props.registry || null}
            data-type="Output"
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            ></div>
    </div>;
};