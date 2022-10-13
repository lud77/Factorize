import * as React from 'react';
import tinycolor from 'tinycolor2';

import { ColorPicker } from '../../../ColorPicker/';
import { Panel } from '../../../../types/Panel';
import debounce from '../../../../utils/debounce';

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
    height: 277
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const [color, setColor] = React.useState('');

        React.useEffect(() => {
            if (color !== '') return;

            if (props.panel.outputEpValues.outputColor == null) {
                setColor({ h: 0, s: 0, v: 1, a: 1 });
                return;
            }

            const { h, s, v, a } = tinycolor(props.panel.outputEpValues.outputColor).toHsv();
            setColor({ h: h / 360, s, v, a });
        }, [color]);

        const handleChange = ({ panel, machine }) => (hsva) => {
            console.log('handleChange', hsva);
            machine.executePanelLogic(panelId, { tuningColor: tinycolor.fromRatio(hsva).toHex8String() });
            setColor(hsva);

            return true;
        };

        const debouncedChange = debounce(handleChange(props));

        return <>
            <div className="Row">
                <div className="InteractiveItem ColorPicker">
                    <ColorPicker
                        color={color}
                        onChange={debouncedChange}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Color" panelId={panelId} {...props}>Color</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        if (inputs.tuningColor == null) return {};
        return { outputColor: inputs.tuningColor };
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