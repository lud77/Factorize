import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'All';

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

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 104
};

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
                <OutputEndpoint name="Out" panelId={panelId} signal="Pulse" description="All of the input pins have now received a pulse" {...props}>Out</OutputEndpoint>
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
                const send = count === panel.inEpsCounter - 1;

                if (send) sendPulseTo(panel.panelId, 'outputOut');
                return { receivedList, sent: send };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        inEps: [],
        inEpsCounter: 3,
        Component,
        execute,
        onPulse
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;