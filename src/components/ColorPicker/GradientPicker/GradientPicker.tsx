import * as React from 'react';

import ToneSelector from '../ToneSelector';
import HueSlider from '../HueSlider';
import OpacitySlider from '../OpacitySlider';
import GradientSlider from './GradientSlider';
import GradientPreview from './GradientPreview';

import '../Picker.css';
import './GradientPicker.css';

const GradientPicker = (props) => {
    return <>
        <div className="Picker GradientPicker">
            <ToneSelector {...props} />
            <GradientSlider {...props} />
            <div className="Controls">
                <div className="Preview">
                    <GradientPreview color={props.color} />
                </div>
                <div className="Sliders">
                    <HueSlider {...props} />
                    <OpacitySlider {...props} />
                </div>
            </div>
        </div>
    </>;
};

export default GradientPicker;