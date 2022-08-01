import React from 'react';

import './PushButton.css';

const PushButton = (props) => {
    return (
        <button className="PushButton" onClick={props.onClick}>{props.children}</button>
    );
};

export default PushButton;