import React from 'react';

import './Toggle.css';

const Toggle = (props) => {
    return (
        <label className="Toggle">
            <input type="checkbox" onChange={props.onChange} />
            <span className="Slider Rounded"></span>
        </label>
    );
};

export default Toggle;