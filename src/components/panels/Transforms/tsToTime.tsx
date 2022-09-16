import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'TsToTime';

const inputEndpoints = [{
    name: 'Timestamp',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Hour',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}, {
    name: 'Minute',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}, {
    name: 'Second',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 144,
    height: 94
};

const create = (panelId: number): Panel => {
    const getHour = (ts) => (new Date(ts)).getHours();
    const getMinute = (ts) => (new Date(ts)).getMinutes();
    const getSecond = (ts) => (new Date(ts)).getSeconds();

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Timestamp" panelId={panelId} {...props}>Timestamp</InputEndpoint>
                <OutputEndpoint name="Hour" panelId={panelId} {...props}>Hour</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Minute" panelId={panelId} {...props}>Minute</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Second" panelId={panelId} {...props}>Second</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (!values.inputTimestamp) return values;

        const ts = parseInt(values.inputTimestamp);

        return {
            outputHour: getHour(ts),
            outputMinute: getMinute(ts),
            outputSecond: getSecond(ts)
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};