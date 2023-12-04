import * as React from 'react';
import tinycolor from 'tinycolor2';

import { GradientPicker } from '../../../ColorPicker';
import { Panel } from '../../../../types/Panel';
import { toGradient } from '../../../../domain/types/Gradient';
import debounce from '../../../../utils/debounce';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../../Editor/Panel/defaultSizes';

import './gradientPicker.css';

const panelType = 'GradientPicker';

const inputEndpoints = [];

const toOutputPoint = (gradientPoint) => {
    return [
        tinycolor.fromRatio(gradientPoint[0]).toHex8String(),
        gradientPoint[1]
    ];
};

const fixGradient = (gradient) => {
    const clone = gradient.contents.map(toOutputPoint);
    const sorted = clone.sort((a, b) => a[1] - b[1]);

    return toGradient(sorted);
};

const defaultGradient = toGradient([[{ h: 0, s: 0, v: 1, a: 0 }, 0], [{ h: 0, s: 0, v: 1, a: 1 }, 100]]);

const outputEndpoints = [{
    name: 'Gradient',
    defaultValue: fixGradient(defaultGradient),
    type: 'gradient',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 255,
    height: 316
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const [steps, setSteps] = React.useState(toGradient(null));

        React.useEffect(() => {
            if (steps.contents != null) return;

            if (props.panel.outputEpValues.outputSteps == null) {
                setSteps(defaultGradient);
                return;
            }

            setSteps(props.panel.outputEpValues.outputSteps);
        }, [steps]);

        const handleChange = ({ panel, machine }) => (newGradient) => {
            const wrappedGradient = toGradient(newGradient);
            machine.executePanelLogic(panelId, { tuningGradient: fixGradient(wrappedGradient), tuningSteps: wrappedGradient });
            setSteps(wrappedGradient);

            return true;
        };

        const debouncedChange = debounce(handleChange(props), 1);
        // console.log('aaaa', steps);
        return <>
            <div className="Row">
                <div className="InteractiveItem GradientPicker">
                    <GradientPicker
                        steps={steps.contents} setSteps={setSteps}
                        onChange={debouncedChange}
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

        if (inputs.tuningGradient == null || inputs.tuningGradient.contents == null) return {};

        return {
            outputSteps: inputs.tuningSteps,
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

const PanelBundle = {
    type: panelType,
    create,
    tags: ['input'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;