import { fas } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';


const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        // machine.executePanelLogic(panelId, {});
        console.log('fire!');
        machine.sendPulseTo(panel.panelId, 'outputSend');
    };

    const Component = (props) => {
        const { inputDice, inputFaces } = props.panel.inputEpValues;

        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button onClick={handleClick(props)}>Emit</button>
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Send" panelId={panelId} signal="Pulse" {...props}>Send</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Send',
        signal: 'Pulse'
    }];

    const execute = (panel, values) => values;

    return {
        type: 'Button',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 100,
        height: 74,
        Component,
        execute
    } as Panel;
};

export default {
    create
};