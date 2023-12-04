import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';
import { CSSProperties } from '@emotion/serialize';

const panelType = 'Text';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Text',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 200,
    height: 200,
    minWidth: 120,
    minHeight: 120
};

const create = (panelId: number): Panel => {
    const handleChangeText = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningText: e.target.value });

        return true;
    };

    const Component = (props) => {
        const style = {
            fontFamily: 'courier',
            fontSize: '15px',
            lineHeight: '15px',
            width: '100%',
            flexGrow: 1,
            display: 'block',
            resize: 'none',
            marginBottom: '5px',
            borderRadius: '5px',
            backgroundColor: 'whitesmoke'
        } as React.CSSProperties;

        return <>
            <div className="Row" style={{ flexGrow: 1 }}>
                <textarea onChange={handleChangeText(props)} defaultValue={props.panel.outputEpValues.outputText} style={style} />
            </div>
            <div className="Row">
                <OutputEndpoint name="Text" panelId={panelId} {...props}>Text</OutputEndpoint>
            </div>
        </>;
    };

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
        ...panelSizes,
        Component,
        execute,
        resizer: 'both'
    } as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['input'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;