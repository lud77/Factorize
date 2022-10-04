import * as React from 'react';
import tinycolor from 'tinycolor2';

import clamp from '../../../utils/clamp';

import './HueSlider.css';

const HueSlider = (props) => {
    const [ pointer, setPointer ] = React.useState(0);
    const [ dragging, setDragging ] = React.useState(false);
    const [ width, setWidth ] = React.useState(0);
    const hueSliderRef = React.useRef();

    const color = props.color;

    React.useEffect(() => {
        if (hueSliderRef.current) {
            setWidth(hueSliderRef.current.clientWidth);

            setPointer(color.h * width);
        }
    }, [width]);

    const pointerStyle = { left: `${pointer - 6}px` };

    const coordsToColor = (x, width, value, saturation, alpha) => {
        let hue = clamp(x / width);
        console.log(tinycolor({ h: hue, s: saturation, v: value, a: alpha })._originalInput);
        return tinycolor.fromRatio({ h: hue, s: saturation, v: value, a: alpha })._originalInput;
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
        const {
            bounds,
            positionX
        } = getMeasures(e);

        e.stopPropagation();

        setDragging(true);
        setPointer(positionX);

        props.onChange(coordsToColor(positionX, bounds.right - bounds.left, color.v, color.s, color.a));
    };

    const mouseMoveHandler = (e) => {
        const {
            bounds,
            startX, startY,
            positionX
        } = getMeasures(e);

        if (!(dragging && startX >= bounds.left && startY >= bounds.top && startX <= bounds.right && startY <= bounds.bottom)) return true;

        e.stopPropagation();

        setPointer(positionX);

        props.onChange(coordsToColor(positionX, bounds.right - bounds.left, color.v, color.s, color.a));
    };

    const mouseUpHandler = (e) => {
        e.stopPropagation();
        setDragging(false);
    };

    return <>
        <div
            ref={hueSliderRef}
            className="HueSlider"
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={mouseUpHandler}
            >
            <div className="Pointer" style={pointerStyle}></div>
        </div>
    </>;
};

export default HueSlider;