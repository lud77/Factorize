import * as React from 'react';

export default (isOutputConnected, connectorAnchor) => (props) => {
    return 	<div className="Output Item">
        {props.children}
        <div 
            className={`
                OutputEndpoint Endpoint
                ${isOutputConnected(props.panel.refs[`output${props.name}`]) ? 'Connected' : ''} 
                ${(connectorAnchor != null) && (connectorAnchor?.fromRef == props.panel.refs[`output${props.name}`]) ? 'Connecting' : ''}
            `}
            data-id={props.panel.refs[`output${props.name}`]} 
            data-ref={`output${props.name}`}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}							
            ></div>
    </div>;
};