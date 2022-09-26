import * as React from 'react';
import { ColorPicker } from 'react-color-gradient-picker';
import tinycolor from 'tinycolor2';

import { Panel } from '../../../../types/Panel';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../../Editor/Panel/defaultSizes';

// import './gradientPicker.css';
import 'react-color-gradient-picker/dist/index.css';

const panelType = 'GradientPicker';

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
    height: 300
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const [color, setColor] = React.useState('#0000');

        const ColorPickerHook = useColorPicker(color, setColor);

        // React.useEffect(() => {
        //     console.log('test');
        //     // setGradient();
        // }, []);

        const handleChange = ({ panel, machine }) => (color) => {
            console.log('handle change');
            machine.executePanelLogic(panelId, { tuningColor: tinycolor(color).toHex8String() });
            setColor(color);

            return true;
        };

        return <>
            <div className="Row">
                <div className="InteractiveItem GradientPicker">
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