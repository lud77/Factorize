import { fas } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import PushButton from '../../PushButton/PushButton';

const panelType = 'Button';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Send',
    signal: 'Pulse'
}];

const panelSizes = {
    ...defaultSizes,
    width: 100,
    height: 94
};

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        e.stopPropagation();
        e.preventDefault();
        machine.sendPulseTo(panel.panelId, 'outputSend');
    };

    const Component = (props) => {
         return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <PushButton onClick={handleClick(props)}>Emit</PushButton>
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Send" panelId={panelId} signal="Pulse" description="UI button pressed" {...props}>Send</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => values;

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

const PanelBundle = {
    type: panelType,
    create,
    tags: ['trigger', 'fire', 'event'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;