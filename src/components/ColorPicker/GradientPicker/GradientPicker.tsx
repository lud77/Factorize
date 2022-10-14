import * as React from 'react';

import ToneSelector from '../ToneSelector/ToneSelector';
import HueSlider from '../HueSlider/HueSlider';
import OpacitySlider from '../OpacitySlider/OpacitySlider';
import GradientSlider from './GradientSlider/GradientSlider';
import GradientPreview from './GradientPreview';

import '../Picker.css';
import './GradientPicker.css';

const GradientPicker = (props) => {
    const [ selectedStep, setSelectedStep ] = React.useState(0);

    const handleChange = (hsva) => {
        const newSteps = [
            ...props.steps.slice(0, selectedStep),
            [hsva, props.steps[selectedStep][1]],
            ...props.steps.slice(selectedStep + 1)
        ];
        console.log('GradientPicker handleChange', hsva, newSteps);
        props.onChange(newSteps);
    };

    // console.log('gradient picker 1', props.steps.map((x) => tinycolor.fromRatio(x[0]).toRgb()));

    if (props.steps == null) return <></>;

    return <>
        <div className="Picker GradientPicker">
            <ToneSelector color={props.steps[selectedStep][0]} onChange={handleChange} />
            <GradientSlider
                {...props}
                selectedStep={selectedStep}
                setSelectedStep={setSelectedStep}
                />
            <div className="Controls">
                <div className="Preview">
                    <GradientPreview steps={props.steps} />
                </div>
                <div className="Sliders">
                    <HueSlider color={props.steps[selectedStep][0]} onChange={handleChange} />
                    <OpacitySlider color={props.steps[selectedStep][0]} onChange={handleChange} />
                </div>
            </div>
        </div>
    </>;
};

export default GradientPicker;