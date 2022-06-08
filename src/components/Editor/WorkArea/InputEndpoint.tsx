import * as React from 'react';

export default (isInputConnected, connectorAnchor) => (props) => {
    const onMouseOver = (e) => {
        if (connectorAnchor == null) return;
        if (e.target.classList.contains('Connected')) return;
        
        e.target.classList.add('Hovering');
    };

    const onMouseOut = (e) => {
		if (connectorAnchor == null) return;

        e.target.classList.remove('Hovering');
    };

    const classes = ['InputEndpoint'];
    if (isInputConnected(props.panel.refs[`input${props.name}`])) classes.push('Connected');

    return <div className="Input Item">
        <div 
            className={ classes.join(' ') }
            ref={props.panel.refs[`input${props.name}`]} 
            data-ref={`input${props.name}`}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            ></div>
        {props.children}
    </div>;
};