import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Time';

const create = (panelId: number): Panel => {
    const getHour = () => (new Date()).getHours();
    const getMinute = () => (new Date()).getMinutes();
    const getSecond = () => (new Date()).getSeconds();

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Fetch" panelId={panelId} signal="Pulse" description="Produce current time" {...props}>Fetch</InputEndpoint>
                <OutputEndpoint name="Hour" panelId={panelId} {...props} description="Current hour of the day">Hour</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Minute" panelId={panelId} {...props} description="Current minutes">Minute</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Second" panelId={panelId} {...props} description="Current seconds">Second</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Fetch',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Hour',
        defaultValue: getHour(),
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Minute',
        defaultValue: getMinute(),
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Second',
        defaultValue: getSecond(),
        type: 'number',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputFetch':
                return {
                    outputHour: getHour(),
                    outputMinute: getMinute(),
                    outputSecond: getSecond()
                };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    type: panelType,
    create
};