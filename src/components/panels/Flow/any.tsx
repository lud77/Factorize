import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Any';

const inputEndpoints = [{
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
                <InputEndpoint name="In1" panelId={panelId} signal="Pulse" description="Input pulse" {...props}>In</InputEndpoint>
                <OutputEndpoint name="Out" panelId={panelId} signal="Pulse" description="Any of the input pins receives a pulse" {...props}>Out</OutputEndpoint>
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
        sendPulseTo(panel.panelId, 'outputOut');
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