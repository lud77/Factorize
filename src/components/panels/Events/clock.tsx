import * as React from 'react';
import { flushSync } from 'react-dom';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Clock';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Active" panelId={panelId} {...props}>Active</InputEndpoint>
                <OutputEndpoint name="Tick" panelId={panelId} signal="Pulse" description="Clock ticks" {...props}>Tick</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Seconds" panelId={panelId} {...props}>Seconds</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Active',
        defaultValue: false,
        signal: 'Value'
    }, {
        name: 'Seconds',
        defaultValue: 1,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Tick',
        signal: 'Pulse'
    }];

    const run = (panel, methods) => {
        if (!panel.inputEpValues.inputActive) return;

        flushSync(() => {
            methods.setPanels((panels) => {
                const currentPanel = panels[panel.panelId];

                const timeoutHandler = setTimeout(() => {
                    methods.sendPulseTo(panel.panelId, 'outputTick');
                    run(currentPanel, methods);
                }, currentPanel.inputEpValues.inputSeconds * 1000);

                return {
                    ...panels,
                    [panel.panelId]: {
                        ...currentPanel,
                        outputEpValues: {
                            ...currentPanel.outputEpValues,
                            timeoutHandler
                        }
                    }
                };
            });
        });
    };

    const execute = (panel, values, methods) => {
        if (panel.outputEpValues.timeoutHandler != null) {
            if (panel.inputEpValues.inputActive) return values;

            clearTimeout(panel.outputEpValues.timeoutHandler);
            return { timeoutHandler: undefined };
        }

        run(panel, methods);

        return values;
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 74
    } as Panel;
};

export default {
    type: panelType,
    create
};