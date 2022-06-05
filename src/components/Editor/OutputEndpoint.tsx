import * as React from 'react';

export default (isOutputConnected, connectorAnchor) => (props) => {
    const classes = ['OutputEndpoint'];
    if (isOutputConnected(props.panel.refs[`output${props.name}`])) classes.push('Connected');
    if ((connectorAnchor != null) && (connectorAnchor.fromRef == props.panel.refs[`output${props.name}`])) classes.push('Connecting');

    return 	<div className="Output Item">
        {props.children}
        <div 
            className={ classes.join(' ') }
            ref={props.panel.refs[`output${props.name}`]} 
            data-ref={`output${props.name}`}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}							
            ></div>
    </div>;
};