import * as React from 'react';
import { ColorPicker } from 'react-color-gradient-picker';
import tinycolor from 'tinycolor2';

import { Panel } from '../../../../types/Panel';
import { toAttrs, fromAttrs } from '../../../../utils/colors';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../../Editor/Panel/defaultSizes';

import 'react-color-gradient-picker/dist/index.css';
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
    height: 330
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const [color, setColor] = React.useState('#ffff');

        const handleChange = ({ panel, machine }) => (color) => {
            machine.executePanelLogic(panelId, { tuningColor: tinycolor(fromAttrs(color)).toHex8String() });
            setColor(color);

            return true;
        };

        return <>
            <div className="Row">
                <div className="InteractiveItem ColorPicker">
                    <ColorPicker
                        color={toAttrs(color)}
                        onStartChange={handleChange(props)}
                        onChange={handleChange(props)}
                        onEndChange={handleChange(props)}
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