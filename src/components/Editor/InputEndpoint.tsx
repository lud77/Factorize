import * as React from 'react';

export default (isInputConnected, connectorAnchor, setConnectorAnchor) => (props) => {
    const onMouseOver = (e) => {
        if (connectorAnchor == null) return;
        if (e.target.classList.contains('Connected')) return;
		
        setConnectorAnchor({ 
			...connectorAnchor,
			toEl: e.target 
		});

        e.target.classList.add('Hovering');
    };

    const onMouseOut = (e) => {
		if (connectorAnchor == null) return;
		
        setConnectorAnchor({ 
			...connectorAnchor,
			toEl: null 
		});

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