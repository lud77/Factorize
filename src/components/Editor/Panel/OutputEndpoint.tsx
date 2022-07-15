import * as React from 'react';

export default (props) => {
    const isOutputConnected = (ref) => props.connections.find((connection) => connection.source === ref);

    const connectedClass = props.single ? 'Connected' : 'Multiconnect';
    const signal = props.signal || 'Value';

    return 	<div className="Output Item">
        {props.children}
        <div
            className={`
                OutputEndpoint Endpoint
                ${isOutputConnected(props.panel.outputRefs[`output${props.name}`]) ? connectedClass : ''}
                ${(props.connectorAnchor != null) && (props.connectorAnchor?.fromRef == props.panel.outputRefs[`output${props.name}`]) ? 'Connecting' : ''}
                ${props.removable ? 'Removable' : ''}
                Signal-${signal}
            `}
            data-ref={props.panel.outputRefs[`output${props.name}`]}
            data-name={`output${props.name}`}
            data-registry={props.registry || null}
            data-type="Output"
            data-signal={signal}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            ></div>
    </div>;
};