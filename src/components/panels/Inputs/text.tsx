import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Text';

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningText: e.target.value });

        return true;
    };

    const Component = (props) => {
        const rowStyle = {
            fontFamily: 'courier',
            fontSize: '15px',
            lineHeight: '15px',
            width: '100%',
            flexGrow: 1,
            display: 'block',
            resize: 'none',
            marginBottom: '2px',
            borderRadius: '4px'
        };

        const textAreaStyle = {
            flexGrow: 1
        };

        return <>
            <div className="Row" style={textAreaStyle}>
                <textarea style={rowStyle} onChange={handleChange(props)}>{props.panel.outputEpValues.outputText}</textarea>
            </div>
            <div className="Row">
                <OutputEndpoint name="Text" panelId={panelId} {...props}>Text</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Text',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        return {
            outputText: inputs.tuningText
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        width: 200,
        height: 200,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create
};