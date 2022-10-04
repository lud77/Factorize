import * as React from 'react';

import ToneSelector from '../ToneSelector';
import HueSlider from '../HueSlider';
import OpacitySlider from '../OpacitySlider';
import ColorPreview from './ColorPreview';

import '../Picker.css';
import './ColorPicker.css';

const ColorPicker = (props) => {
    return <>
        <div className="Picker ColorPicker">
            <ToneSelector {...props} />
            <div className="Controls">
                <div className="Preview">
                    <ColorPreview color={props.color} />
                </div>
                <div className="Sliders">
                    <HueSlider {...props} />
                    <OpacitySlider {...props} />
                </div>
            </div>
        </div>
    </>;
};

export default ColorPicker;