import * as React from 'react';
import { ColorPicker } from 'react-color-gradient-picker';
import tinycolor from 'tinycolor2';

import { Panel } from '../../../../types/Panel';
import { toAttrs, fromAttrs } from '../../../../utils/colors';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../../Editor/Panel/defaultSizes';

import 'react-color-gradient-picker/dist/index.css';
import './gradientPicker.css';

const panelType = 'GradientPicker';

const inputEndpoints = [];

const toGradientPoint = (color, step) => {
    return {
        left: step,
        ...toAttrs(color)
    };
};

const toOutputPoint = (gradientPoint) => {
    return [
        tinycolor(fromAttrs(gradientPoint)).toHex8String(),
        gradientPoint.left
    ];
};

const makeGradient = (points) => {
    return {
        points: points.map(([ color, step ]) => toGradientPoint(color, step)),
        degree: 0,
        type: 'linear'
    };
};

const fixGradient = (gradient) => {
    const clone = gradient.points.map(toOutputPoint);
    const sorted = clone.sort((a, b) => a[1] - b[1]);

    if (sorted[0][1] != 0) sorted.unshift([sorted[0][0], 0]);
    if (sorted[sorted.length - 1][1] != 100) sorted.push([sorted[sorted.length - 1][0], 100]);
    return sorted;
};

const defaultGradient = makeGradient([['#000f', 0], ['#ffff', 100]]);

const outputEndpoints = [{
    name: 'Gradient',
    defaultValue: fixGradient(defaultGradient),
    type: 'array',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 255,
    height: 350
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const [gradient, setGradient] = React.useState(defaultGradient);
        console.log('component', gradient);

        const handleChange = ({ panel, machine }) => (newGradient) => {
            machine.executePanelLogic(panelId, { tuningGradient: fixGradient(newGradient) });
            setGradient(newGradient);

            return true;
        };

        return <>
            <div className="Row">
                <div className="InteractiveItem GradientPicker">
                    <ColorPicker
                        gradient={gradient}
                        // onStartChange={handleChange(props)}
                        onChange={handleChange(props)}
                        // onEndChange={handleChange(props)}
                        isGradient
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Gradient" panelId={panelId} {...props}>Gradient</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute gradientPicker', inputs);
        if (inputs.tuningGradient == null) return {};

        console.log('gradientPicker 1');
        return { outputGradient: inputs.tuningGradient };
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