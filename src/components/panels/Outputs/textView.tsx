import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { getExtendedFormat } from '../../../domain/Contents';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'TextView';

const inputEndpoints = [{
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}];

const outputEndpoints = [];

const panelSizes = {
    ...defaultSizes,
    width: 200,
    height: 200,
    minWidth: 120,
    minHeight: 120
};

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

        const inputValue = props.panel.inputEpValues.inputValue != null ? props.panel.inputEpValues.inputValue : '';

        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <div className="InteractiveItem" style={{ textAlign: 'right' }}>
                    <button className="Button" title="Increase font size" onClick={handleClickPlus(props)} style={{ width: '2em', marginRight: '1px' }}>+</button>
                    <button className="Button" title="Decrease font size" onClick={handleClickMinus(props)} style={{ width: '2em' }}>-</button>
                </div>
            </div>
            <div className="Row" style={displayStyle}>
                {getExtendedFormat(inputValue).split('\n').map((str, i) => <p key={i} style={paragraphStyle}>{str}</p>)}
            </div>
        </>;
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
        ...panelSizes,
        Component,
        execute,
        resizer: 'both'
    } as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['output'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;