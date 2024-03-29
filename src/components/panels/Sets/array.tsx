import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Array';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'List',
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 74
};

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Item`,
            `Item${panel.itemEpsCounter}`,
            'any',
            '',
            'Value',
            '',
            'itemEps'
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
                <OutputEndpoint name="List" panelId={panelId} {...props}>List</OutputEndpoint>
            </div>
            {
                props.panel.itemEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="itemEps" editor="text" {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const execute = (panel, values) => {
        const eps = panel.itemEps.map(([ep]) => ep);

        console.log('execute array', panel.itemEps, eps.map((ep) => (values[ep] != null) ? values[ep] : panel.inputEpValues[ep]));

        return { outputList: eps.map((ep) => (values[ep] != null) ? values[ep] : panel.inputEpValues[ep]) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        itemEps: [],
        itemEpsCounter: 1,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['list', 'set', 'collection'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;