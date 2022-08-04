import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Date';

const create = (panelId: number): Panel => {
    const getDay = () => (new Date()).getDate();
    const getMonth = () => (new Date()).getMonth() + 1;
    const getYear = () => (new Date()).getFullYear();
    const getWeekDay = () => (new Date()).getDay();

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Fetch" panelId={panelId} signal="Pulse" description="Produce current date" {...props}>Fetch</InputEndpoint>
                <OutputEndpoint name="Day" panelId={panelId} {...props} description="Current day of the month">Day</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Month" panelId={panelId} {...props} description="Current month">Month</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Year" panelId={panelId} {...props} description="Current year">Year</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="WeekDay" panelId={panelId} {...props} description="Current day of the Week">Week Day</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Fetch',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Day',
        defaultValue: getDay(),
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Month',
        defaultValue: getMonth(),
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Year',
        defaultValue: getYear(),
        type: 'number',
        signal: 'Value'
    }, {
        name: 'WeekDay',
        defaultValue: getWeekDay(),
        type: 'number',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputFetch':
                return {
                    outputDay: getDay(),
                    outputMonth: getMonth(),
                    outputYear: getYear(),
                    outputWeekDay: getWeekDay()
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
        height: 114,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    type: panelType,
    create
};