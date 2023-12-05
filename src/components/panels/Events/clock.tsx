import * as React from 'react';
import { flushSync } from 'react-dom';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Clock';

const inputEndpoints = [{
    name: 'Active',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}, {
    name: 'Seconds',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Tick',
    signal: 'Pulse'
}];

const panelSizes = {
    ...defaultSizes,
    height: 74
};

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

    const expunge = ['timeoutHandler'];

    const run = (panel, values, methods) => {
        console.log('execute clock - runner - activation', values.inputActive, panel.inputEpValues.inputActive);
        if (values.inputActive == false && !panel.inputEpValues.inputActive) return;

        flushSync(() => {
            methods.setPanels((panels) => {
                const currentPanel = panels[panel.panelId];

                if (!currentPanel) return panels;

                const timeoutHandler = methods.timers.setTimer(() => {
                    if (!currentPanel.inputEpValues.inputActive) return;

                    methods.sendPulseTo(panel.panelId, 'outputTick');
                    run(currentPanel, values, methods);
                }, currentPanel.inputEpValues.inputSeconds * 1000);

                if (!currentPanel.inputEpValues.inputActive) {
                    methods.timers.clearTimer(timeoutHandler);

                    return {
                        ...panels,
                        [panel.panelId]: {
                            ...currentPanel,
                            outputEpValues: {
                                ...currentPanel.outputEpValues,
                                timeoutHandler: undefined
                            }
                        }
                    };
                }

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
        console.log('execute clock - start');
        console.log('execute clock - handler', panel.outputEpValues.timeoutHandler != null);
        if (panel.outputEpValues.timeoutHandler != null) {
            const isActive = values.inputActive || (values.inputActive == null && panel.inputEpValues.inputActive);
            console.log('execute clock - activation', values.inputActive, panel.inputEpValues.inputActive, isActive);
            if (isActive) return values;

            methods.timers.clearTimer(panel.outputEpValues.timeoutHandler);
            return { timeoutHandler: undefined };
        }

        run(panel, values, methods);

        return values;
    };

    const dispose = (panel, { clearTimer }) => {
        if (panel.outputEpValues.timeoutHandler != null) {
            clearTimer(panel.outputEpValues.timeoutHandler);
        }
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute,
        dispose,
        expunge
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['cron', 'repeat', 'schedule', 'event'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;