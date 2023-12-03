import * as React from 'react';
import tinycolor from 'tinycolor2';

import clamp from '../../../utils/clamp';

import './OpacitySlider.css';

const OpacitySlider = (props) => {
    const [ pointer, setPointer ] = React.useState(0);
    const [ dragging, setDragging ] = React.useState(false);
    const [ width, setWidth ] = React.useState(0);
    const opacitySliderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (opacitySliderRef.current) {
            setWidth(opacitySliderRef.current.clientWidth);
            console.log('opacity', props.color);
            setPointer(props.color.a * width);
        }
    }, [width, props.color]);

    const color = props.color;
    const colorHsl = tinycolor.fromRatio(props.color).toHsl();

    const overlayStyle = { background: `linear-gradient(to right, hsl(${colorHsl.h}, ${colorHsl.s * 100}%, ${colorHsl.l * 100}%, 0), hsl(${colorHsl.h}, ${colorHsl.s * 100}%, ${colorHsl.l * 100}%, 1))` };

    const pointerStyle = { left: `${pointer - 6}px` };

    const coordsToColor = (x, hue, value, saturation) => {
        let alpha = clamp(x / width);
        return { h: hue, s: saturation, v: value, a: alpha };
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
            startX, startY,
            positionX
        } = getMeasures(e);

        if (!(startX >= bounds.left && startY >= bounds.top && startX <= bounds.left + width - 1 && startY <= bounds.bottom)) return true;

        e.stopPropagation();

        setDragging(true);
        setPointer(positionX);

        props.onChange(coordsToColor(positionX, color.h, color.v, color.s));
    };

    const mouseMoveHandler = (e) => {
        if (e.buttons === 0) {
            setDragging(false);
            return true;
        }

        const {
            bounds,
            startX, startY,
            positionX
        } = getMeasures(e);

        if (!(dragging && startX >= bounds.left && startY >= bounds.top && startX <= bounds.left + width - 1 && startY <= bounds.bottom)) return true;

        e.stopPropagation();

        setPointer(positionX);

        props.onChange(coordsToColor(positionX, color.h, color.v, color.s));
    };

    const mouseUpHandler = (e) => {
        e.stopPropagation();
        setDragging(false);
    };

    return <>
        <div
            ref={opacitySliderRef}
            className="OpacitySlider"
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={mouseUpHandler}
            >
            <div className="Overlay" style={overlayStyle}>
                <div className="Pointer" style={pointerStyle}></div>
            </div>
        </div>
    </>;
};

export default OpacitySlider;