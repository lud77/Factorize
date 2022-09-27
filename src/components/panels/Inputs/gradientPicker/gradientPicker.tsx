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
        fromAttrs(gradientPoint),
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

const defaultGradient = makeGradient([['#000f', 0], ['#ffff', 100]]);

const outputEndpoints = [{
    name: 'Gradient',
    defaultValue: defaultGradient,
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

        const handleChange = ({ panel, machine }) => (gradient) => {
            machine.executePanelLogic(panelId, { tuningGradient: gradient.points.map(toOutputPoint) });
            setGradient(gradient);

            return true;
        };

        return <>
            <div className="Row">
                <div className="InteractiveItem GradientPicker">
                    <ColorPicker
                        gradient={gradient}
                        onStartChange={handleChange(props)}
                        onChange={handleChange(props)}
                        onEndChange={handleChange(props)}
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
        return {
            outputGradient: inputs.tuningGradient
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