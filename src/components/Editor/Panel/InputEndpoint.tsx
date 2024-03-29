import * as React from 'react';

import { getDataTypeMarkerFor } from '../../../domain/Contents';

const InputEndpoint = (props) => {
    const [ isEditing, setIsEditing ] = React.useState(false);

	const isInputConnected = (ref) => props.connections.find((connection) => connection.target === ref);

    const signal = props.signal || 'Value';

    const ep = `input${props.name}`;
    const isValue = props.panel.inputSignalByEp[ep] === 'Value';

    const isConnected = isInputConnected(props.panel.inputRefs[ep]);

    const epValue = isValue
        ? `${props.panel.inputEpValues[ep]}`
        : (props.description || '');

    const dataTypeMarker = isValue
        ? getDataTypeMarkerFor(props.panel.inputTypeByEp[ep])
        : '>';

    const epType = isValue
        ? `${props.panel.inputTypeByEp[ep]} type value`
        : props.panel.inputSignalByEp[ep].toLowerCase();

    const onMouseOver = (e) => {
        if (props.connectorAnchor == null) return;
        if (e.target.classList.contains('Connected')) return;

        e.target.classList.add('Hovering');
    };

    const onMouseOut = (e) => {
		if (props.connectorAnchor == null) return;

        e.target.classList.remove('Hovering');
    };

    const startEditing = (props) => (e) => {
        setIsEditing(true);
    };

    const finishEditing = (props) => (e) => {
        setIsEditing(false);
        props.setPanels((panels) => ({
            ...panels,
            [props.panel.panelId]: {
                ...props.panel,
                inputEpDefaults: {
                    ...props.panel.inputEpDefaults,
                    [`input${props.name}`]: e.target.value
                }
            }
        }));

        props.machine.executePanelLogic(props.panel.panelId, { [`input${props.name}`]: e.target.value });
    };

    const editing = (e) => {
        e.stopPropagation();

        if (e.key === "Enter") finishEditing(props)(e);
    };

    // console.log('+++++++++++++++++++', ep, props.panel.inputSignalByEp[ep]);

    const style = {
        flexGrow: props.span != null ? props.span : 'none',
        textDecoration: props.editor ? 'underline' : 'none',
        textDecorationStyle: isConnected ? 'dotted' : 'solid'
    } as React.CSSProperties;

    return <>
        <div
            className="Input Item"
            title={ `(${epType}) ${epValue}` }
            onDoubleClick={props.editor && !isConnected ? startEditing(props) : undefined}
            style={style}
            >
            <div
                className={`
                    InputEndpoint Endpoint
                    ${isConnected ? 'Connected' : ''}
                    ${(props.connectorAnchor != null) && (props.connectorAnchor?.toRef === props.panel.inputRefs[ep]) ? 'Connecting' : ''}
                    ${props.removable ? 'Removable' : ''}
                    Signal-${signal}
                    ${isEditing ? 'Edit' : ''}
                `}
                data-ref={props.panel.inputRefs[ep]}
                data-name={ep}
                data-registry={props.registry || null}
                data-type="Input"
                data-signal={signal}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                >
                {dataTypeMarker}
            </div>
            {
                isEditing
                    ? <>
                        <input
                            autoFocus
                            type="text"
                            defaultValue={epValue}
                            onBlur={finishEditing(props)}
                            onKeyUp={(e) => e.stopPropagation()}
                            onKeyPress={editing}
                            />
                    </>
                    : <>
                        {props.children}
                    </>
            }
        </div>
    </>;
};

export default InputEndpoint;