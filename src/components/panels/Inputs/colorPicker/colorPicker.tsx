import * as React from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import tinycolor from 'tinycolor2';

import { Panel } from '../../../../types/Panel';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../../Editor/Panel/defaultSizes';

import './colorPicker.css';

const panelType = 'ColorPicker';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Color',
    defaultValue: '#ffff',
    type: 'string',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 255,
    height: 260
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const [color, setColor] = React.useState('rgba(255,255,255,1)');

        const handleChange = ({ panel, machine }) => (color) => {
            machine.executePanelLogic(panelId, { tuningColor: tinycolor(color).toHex8String() });
            setColor(color);

            return true;
        };

        return <>
            <div className="Row">
                <div className="InteractiveItem ColorPicker">
                    <ColorPicker
                        value={color}
                        onChange={handleChange(props)}
                        width={250}
                        height={100}
                        hideControls={true}
                        hidePresets={true}
                        hideEyeDrop={true}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Color" panelId={panelId} {...props}>Color</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        return {
            outputColor: inputs.tuningColor
        };
    };

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

export default {
    type: panelType,
    create,
    tags: ['input'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};