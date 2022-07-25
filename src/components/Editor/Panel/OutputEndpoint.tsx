import * as React from 'react';

export default (props) => {
    const isOutputConnected = (ref) => props.connections.find((connection) => connection.source === ref);

    const connectedClass = props.single ? 'Connected' : 'Multiconnect';
    const signal = props.signal || 'Value';

    const ep = `output${props.name}`;
    const epValue = props.panel.outputSignalByEp[ep] === 'Value' ? `${props.panel.outputEpValues[ep]}` : (props.description || '');

    return 	<div className="Output Item" title={ epValue }>
        {props.children}
        <div
            className={`
                OutputEndpoint Endpoint
                ${isOutputConnected(props.panel.outputRefs[ep]) ? connectedClass : ''}
                ${(props.connectorAnchor != null) && (props.connectorAnchor?.fromRef == props.panel.outputRefs[ep]) ? 'Connecting' : ''}
                ${props.removable ? 'Removable' : ''}
                Signal-${signal}
            `}
            data-ref={props.panel.outputRefs[ep]}
            data-name={ep}
            data-registry={props.registry || null}
            data-type="Output"
            data-signal={signal}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            ></div>
    </div>;
};