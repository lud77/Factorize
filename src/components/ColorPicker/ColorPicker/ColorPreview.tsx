import * as React from 'react';
import tinycolor from 'tinycolor2';

const ColorPreview = (props) => {
    const style = { background: tinycolor.fromRatio(props.color).toHex8String() };
    return <>
        <div className="ColorPreview">
            <div className="Color" style={style}></div>
        </div>
    </>;
};

export default ColorPreview;