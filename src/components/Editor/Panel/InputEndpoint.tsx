import * as React from 'react';

export default (props) => {
	const isInputConnected = (ref) => props.connections.find((connection) => connection.target === ref);

    const onMouseOver = (e) => {
        if (props.connectorAnchor == null) return;
        if (e.target.classList.contains('Connected')) return;

        e.target.classList.add('Hovering');
    };

    const onMouseOut = (e) => {
		if (props.connectorAnchor == null) return;

        e.target.classList.remove('Hovering');
    };

    const signal = props.signal || 'Value';

    const ep = `input${props.name}`;
    const epValue = props.panel.inputSignalByEp[ep] === 'Value' ? `${props.panel.inputEpValues[ep]}` : (props.description || '');

    return <div className="Input Item" title={ epValue }>
        <div
            className={`
                InputEndpoint Endpoint
                ${isInputConnected(props.panel.inputRefs[ep]) ? 'Connected' : ''}
                ${props.removable ? 'Removable' : ''}
                Signal-${signal}
            `}
            data-ref={props.panel.inputRefs[ep]}
            data-name={ep}
            data-registry={props.registry || null}
            data-type="Input"
            data-signal={signal}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            ></div>
        {props.children}
    </div>;
};