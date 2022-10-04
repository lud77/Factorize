import * as React from 'react';
import tinycolor from 'tinycolor2';

const GradientPreview = (props) => {
    const style = { background: tinycolor.fromRatio(props.color).toHex8String() };
    return <>
        <div className="GradientPreview">
            <div className="Gradient" style={style}></div>
        </div>
    </>;
};

export default GradientPreview;