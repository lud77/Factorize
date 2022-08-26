import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'All';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `In`,
            `In${panel.inEpsCounter}`,
            undefined,
            undefined,
            'Pulse',
            0,
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
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Wait for all inputs again" {...props}>Reset</InputEndpoint>
                <OutputEndpoint name="Out" panelId={panelId} signal="Pulse" description="Any of the input pins receives a pulse" {...props}>Out</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="In1" panelId={panelId} signal="Pulse" description="Input pulse" {...props}>In</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="In2" panelId={panelId} signal="Pulse" description="Input pulse" {...props}>In</InputEndpoint>
            </div>
            {
                props.panel.inEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} signal="Pulse" description="Input pulse" removable={true} registry="inEps" {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const inputEndpoints = [{
        name: 'Reset',
        signal: 'Pulse'
    }, {
        name: 'In1',
        signal: 'Pulse'
    }, {
        name: 'In2',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Out',
        signal: 'Pulse'
    }];

    const onPulse = (ep, panel, { sendPulseTo }) => {
        switch (ep) {
            case 'inputReset':
                return {
                    receivedList: {},
                    sent: false
                };

            default:
                const receivedList = {
                    ...(panel.outputEpValues.receivedList || {}),
                    [ep]: true
                };

                if (panel.outputEpValues.sent) return {};

                const count = Object.values(receivedList).filter(Boolean).length;
                if (count === panel.inEpsCounter - 1) sendPulseTo(panel.panelId, 'outputOut');
                return { receivedList, sent: true };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 104,
        inEps: [],
        inEpsCounter: 3,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    type: panelType,
    create
};