import * as React from 'react';

import './ComboBox.css';

const ComboBox = (props) => {
    return <>
        <div
            className="ComboBox"
            style={{ left: props.left, top: props.top }}
            >
            <div className="Search">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="Results">

            </div>
        </div>
    </>;
};

export default ComboBox;