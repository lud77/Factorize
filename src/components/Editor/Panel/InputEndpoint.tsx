import * as React from 'react';

import getDataTypeMarkerFor from './dataTypes';

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
    const isValue = props.panel.inputSignalByEp[ep] === 'Value';

    const epValue = isValue
        ? `${props.panel.inputEpValues[ep]}`
        : (props.description || '');

    const dataTypeMarker = isValue
        ? getDataTypeMarkerFor(props.panel.inputTypeByEp[ep])
        : '>';

    // console.log('+++++++++++++++++++', ep, props.panel.inputSignalByEp[ep]);

    const epType = isValue
        ? `${props.panel.inputTypeByEp[ep]} value`
        : props.panel.inputSignalByEp[ep].toLowerCase();

    return <div className="Input Item" title={ `(${epType}) ${epValue}` }>
        <div
            className={`
                InputEndpoint Endpoint
                ${isInputConnected(props.panel.inputRefs[ep]) ? 'Connected' : ''}
                ${(props.connectorAnchor != null) && (props.connectorAnchor?.toRef == props.panel.inputRefs[ep]) ? 'Connecting' : ''}
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
            >{dataTypeMarker}</div>
        {props.children}
    </div>;
};