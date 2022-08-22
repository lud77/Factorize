import React from 'react';

import './PushButton.css';

const PushButton = (props) => (<button className="PushButton" onClick={props.onClick}>{props.children}</button>);

export default PushButton;