import * as React from 'react';

export default (isOutputConnected, getSourceRef) => (props) => {
    const mouseOver = (e) => {};

    const mouseOut = (e) => {};

    return 	<div className="Output Item">
        {props.children}
        <div 
            className={ `OutputEndpoint ${isOutputConnected(props.panel.refs[`output${props.name}`]) ? 'Connected' : ''} ${getSourceRef() == props.panel.refs[`output${props.name}`] ? 'Connecting' : ''}` }
            ref={props.panel.refs[`output${props.name}`]} 
            data-ref={`output${props.name}`}
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}							
            ></div>
    </div>;
};