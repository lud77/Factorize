import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Switch';

const inputEndpoints = [{
    name: 'Select',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'In1',
    defaultValue: undefined,
    type: 'any',
    signal: 'Value'
}, {
    name: 'In2',
    defaultValue: undefined,
    type: 'any',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Out',
    defaultValue: 0,
    type: 'any',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 114
};

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `In`,
            `In${panel.inEpsCounter}`,
            'any',
            undefined,
            'Value',
            undefined,
            'inEps'
        );
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button className="Button" onClick={handleClick(props)}>+</button>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Select" panelId={panelId} {...props}>Select</InputEndpoint>
                <OutputEndpoint name="Out" panelId={panelId} {...props}>Out</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="In1" panelId={panelId} {...props}>In (0)</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="In2" panelId={panelId} {...props}>In (1)</InputEndpoint>
            </div>
            {
                props.panel.inEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="inEps" {...props}>{label} ({key + 2})</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const execute = (panel, values) => {
        const eps = ['inputIn1', 'inputIn2'].concat(panel.inEps.map(([ep]) => ep));

        return { outputOut: eps[values.inputSelect] != null ? values[eps[values.inputSelect]] : '' };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        inEps: [],
        inEpsCounter: 3,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['switch'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};