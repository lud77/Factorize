import React from 'react';

import clamp from '../../utils/clamp';

import './Knob.css';

const Knob = (props) => {
    const [ value, setValue ] = React.useState(props.value);

    const degrees = 360 * value;
    const seg1 = Math.min(degrees, 95);
    const seg2 = Math.max(0, Math.min(degrees - 90, 95));
    const seg3 = Math.max(0, Math.min(degrees - 180, 95));
    const seg4 = Math.max(0, Math.min(degrees - 270, 95));
    const offset = 90;

    const onMouseWheel = (e) => {
        const newValue = clamp(value - e.deltaY / 6000);
        setValue(newValue);
        props.onMouseWheel(newValue);
    };

    return (
        <div className="Knob" onWheel={onMouseWheel}>
            <div className="Container">
                <div className="Circle">
                    <div className="Segment" style={{ transform: `rotate(${offset + 0}deg) skew(${90 - seg1}deg)` }}></div>
                    <div className="Segment" style={{ transform: `rotate(${offset + 90}deg) skew(${90 - seg2}deg)` }}></div>
                    <div className="Segment" style={{ transform: `rotate(${offset + 180}deg) skew(${90 - seg3}deg)` }}></div>
                    <div className="Segment" style={{ transform: `rotate(${offset + 270}deg) skew(${90 - seg4}deg)` }}></div>
                    <div className="Inner"></div>
                    <div className="Value">{Math.round(props.value * 100)}%</div>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default Knob;