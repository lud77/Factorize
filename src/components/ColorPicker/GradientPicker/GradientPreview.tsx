import * as React from 'react';
import tinycolor from 'tinycolor2';

const GradientPreview = (props) => {
    const sortedSteps = props.steps.slice();

    sortedSteps.sort((a, b) => a[1] - b[1]);

    const stepsList =
        sortedSteps
            .map((step) => [tinycolor.fromRatio(step[0]).toRgbString(), step[1]])
            .map((step) => `${step[0]} ${step[1]}%`)
            .join(',');

    const gradientStyle = { background: `linear-gradient(to bottom, ${stepsList})` };

    return <>
        <div className="GradientPreview">
            <div className="Gradient" style={gradientStyle}></div>
        </div>
    </>;
};

export default GradientPreview;