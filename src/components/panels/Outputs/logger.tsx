import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Logger';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const handleClickPlus = ({ panel, machine }) => () => {
            const fontSize = panel.outputEpValues.outputFontSize || 15;
            machine.executePanelLogic(panelId, {
                tuningFontSize: Math.min(fontSize + 1, 50)
            });
        };

        const handleClickMinus = ({ panel, machine }) => () => {
            const fontSize = panel.outputEpValues.outputFontSize || 15;
            machine.executePanelLogic(panelId, {
                tuningFontSize: Math.max(fontSize - 1, 5)
            });
        };

        const fontSize = props.panel.outputEpValues.outputFontSize || 15;

        const displayStyle = {
            fontFamily: 'courier',
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize}px`,
            overflow: 'auto',
            width: '100%',
            backgroundColor: 'var(--background)',
            flexGrow: 1,
            display: 'block',
            marginTop: '2px',
            borderRadius: '5px'
        };

        const paragraphStyle = {
            margin: '1px'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Log" panelId={panelId} signal="Pulse" description="Append the [Message] to the [Contents]" {...props}>Log</InputEndpoint>
                <OutputEndpoint name="Contents" panelId={panelId} {...props}>Contents</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Message" panelId={panelId} {...props}>Message</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Clear" panelId={panelId} signal="Pulse" description="Clear the [Contents]" {...props}>Clear</InputEndpoint>
                <div className="InteractiveItem" style={{ textAlign: 'right' }}>
                    <button className="Button" title="Increase font size" onClick={handleClickPlus(props)} style={{ width: '2em', marginRight: '1px' }}>+</button>
                    <button className="Button" title="Decrease font size" onClick={handleClickMinus(props)} style={{ width: '2em' }}>-</button>
                </div>
            </div>
            <div className="Row" style={displayStyle}>
                {String(props.panel.outputEpValues.outputContents || '').split('\n').map((str, i) => <p key={i} style={paragraphStyle}>{str}</p>)}
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Log',
        signal: 'Pulse'
    }, {
        name: 'Message',
        defaultValue: '',
        type: 'any',
        signal: 'Value'
    }, {
        name: 'Clear',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Contents',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputLog':
                return { outputContents: panel.outputEpValues.outputContents + panel.inputEpValues.inputMessage + os.EOL };
            case 'inputClear':
                return { outputContents: '' };
        }
    };

    const execute = (panel, inputs) => {
        return {
            outputFontSize: inputs.tuningFontSize
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        onPulse,
        width: 200,
        height: 200,
        minWidth: 120,
        minHeight: 150,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['log', 'screen', 'monitor']
};