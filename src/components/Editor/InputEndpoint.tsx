import * as React from 'react';

export default (connectorAnchor, setConnectorAnchor, isInputConnected) => (props) => {
    const mouseOver = (e) => {
        if (connectorAnchor == null) return;
        if (e.target.classList.contains('Connected')) return;

        setConnectorAnchor({
            ...connectorAnchor,
            toEl: e.target
        });

        e.target.classList.add('Hovering');
    };

    const mouseOut = (e) => {
        setConnectorAnchor({
            ...connectorAnchor,
            toEl: null
        });

        e.target.classList.remove('Hovering');
    };

    return <div className="Input Item">
        <div 
            className={ `InputEndpoint ${isInputConnected(props.panel.refs[`input${props.name}`]) ? 'Connected' : ''}` }
            ref={props.panel.refs[`input${props.name}`]} 
            data-ref={`input${props.name}`}
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}
            ></div>
        {props.children}
    </div>;
};