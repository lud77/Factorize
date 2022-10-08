import * as React from 'react';
import tinycolor from 'tinycolor2';

import './GradientSlider.css';

const GradientSlider = (props) => {
    const [ width, setWidth ] = React.useState(0);
    const [ dragging, setDragging ] = React.useState(null);
    const gradientSliderRef = React.useRef();

    React.useEffect(() => {
        if (gradientSliderRef.current) {
            setWidth(gradientSliderRef.current.clientWidth);
        }
    }, [width]);

    const sortedSteps = props.steps.slice();

    sortedSteps.sort((a, b) => a[1] - b[1]);

    const stepsList =
        sortedSteps
            .map((step) => [tinycolor.fromRatio(step[0]).toRgb(), step[1]])
            .map((step) => `rgba(${step[0].r}, ${step[0].g}, ${step[0].b}, ${step[0].a}) ${step[1]}%`)
            .join(',');

    const gradientStyle = { background: `linear-gradient(to right, ${stepsList})` };

    const getPointerStyle = (step) => {
        if (width == 0) return { left: 0 };

        const left = step[1] * width / 100 - 6;
        return { left };
    };

    const getPointerColorStyle = (step) => {
        const hsl = tinycolor.fromRatio(step[0]).toHslString();
        return { backgroundColor: hsl };
    };

    const getLineStyle = (step) => {
        if (width == 0) return { left: 0 };

        const left = step[1] * width / 100 - 1;
        return { left };
    };

    const getCrossStyle = (step) => {
        if (width == 0) return { left: 0 };

        const left = step[1] * width / 100 - 6;
        return { left };
    };

    const getMeasures = (e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const elementX = bounds.x;
        const startX = e.pageX;
        const startY = e.pageY;
        const positionX = startX - elementX;

        return {
            bounds,
            startX, startY,
            positionX
        };
    };

    const mouseDownHandler = (e) => {
        const pointer = e.target.closest('.Pointer');
        if (pointer) { // select step
            e.stopPropagation();

            const stepIndex = parseInt(pointer.dataset.step);
            props.setSelectedStep(stepIndex);

            if (stepIndex == 0 || stepIndex == props.steps.length - 1) return true;

            setDragging(stepIndex);
            return;
        }

        const cross = e.target.closest('.Cross');
        if (cross) { // remove step
            e.stopPropagation();

            const stepIndex = parseInt(cross.dataset.step);

            const newSteps = [
                ...props.steps.slice(0, stepIndex),
                ...props.steps.slice(stepIndex + 1)
            ];

            console.log('xxx', stepIndex, props.steps, newSteps);

            // props.setSteps(newSteps);
            props.onChange(newSteps);
            props.setSelectedStep(Math.max(stepIndex - 1, 0));
            return;
        }

        const editor = e.target.closest('.GradientEditor');
        if (editor) { // add step
            const { positionX } = getMeasures(e);

            e.stopPropagation();

            const left = 100 * positionX / width;

            const insertIndex = props.steps.findIndex((step) => left <= step[1]) - 1;

            const newSteps = [
                ...props.steps.slice(0, insertIndex + 1),
                [props.steps[insertIndex][0], left],
                ...props.steps.slice(insertIndex + 1)
            ];

            // props.setSteps(newSteps);
            props.onChange(newSteps);
            props.setSelectedStep(props.selectedStep + 1);
            return;
        }
    };

    const mouseMoveHandler = (e) => {
        if (!dragging) return true;

        const { positionX } = getMeasures(e);

        e.stopPropagation();

        const left = 100 * positionX / width;
        console.log('xyyyy', props.steps, dragging);
        const newSteps = [
            ...props.steps.slice(0, dragging),
            [props.steps[dragging][0], left],
            ...props.steps.slice(dragging + 1)
        ];

        props.onChange(newSteps);
        // props.setSteps(newSteps);
    };

    const mouseUpHandler = (e) => {
        setDragging(null);
    };

    return <>
        <div
            ref={gradientSliderRef}
            className="GradientSlider"
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={mouseUpHandler}
            >
            <div className="Checkered">
                <div className="GradientEditor" style={gradientStyle}>
                    {
                        props.steps.map((step, key) => {
                            return <div key={key}>
                                <div className="Pointer" style={getPointerStyle(step)} data-step={key}>
                                    <div className="Color" style={getPointerColorStyle(step)}></div>
                                </div>
                                <div className="Line" style={getLineStyle(step)}></div>
                                {
                                    (key != 0) && (key != props.steps.length - 1)
                                        ? <div className="Cross" style={getCrossStyle(step)} data-step={key}>⨯</div>
                                        : null
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </>;
};

export default GradientSlider;