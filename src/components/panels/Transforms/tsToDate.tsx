import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'TsToDate';

const inputEndpoints = [{
    name: 'Timestamp',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Day',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}, {
    name: 'Month',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}, {
    name: 'Year',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}, {
    name: 'WeekDay',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const getDay = (ts) => (new Date(ts)).getDate();
    const getMonth = (ts) => (new Date(ts)).getMonth() + 1;
    const getYear = (ts) => (new Date(ts)).getFullYear();
    const getWeekDay = (ts) => (new Date(ts)).getDay();

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Timestamp" panelId={panelId} {...props}>Timestamp</InputEndpoint>
                <OutputEndpoint name="Day" panelId={panelId} {...props}>Day</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Month" panelId={panelId} {...props}>Month</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Year" panelId={panelId} {...props}>Year</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="WeekDay" panelId={panelId} {...props}>Week Day</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (!values.inputTimestamp) return values;

        const ts = parseInt(values.inputTimestamp);

        return {
            outputDay: getDay(ts),
            outputMonth: getMonth(ts),
            outputYear: getYear(ts),
            outputWeekDay: getWeekDay(ts)
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 144,
        height: 114,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints
};