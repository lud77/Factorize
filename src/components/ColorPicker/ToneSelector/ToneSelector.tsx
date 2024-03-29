import * as React from 'react';
import tinycolor from 'tinycolor2';

import clamp from '../../../utils/clamp';

import './ToneSelector.css';

const ToneSelector = (props) => {
    const [ pointer, setPointer ] = React.useState([0, 0]);
    const [ dragging, setDragging ] = React.useState(false);
    const [ width, setWidth ] = React.useState(0);
    const [ height, setHeight ] = React.useState(0);
    const toneSelectorRef = React.useRef<HTMLDivElement>(null);

    const color = props.color;
    const bgColor = tinycolor.fromRatio({ h: color.h, s: 1, v: 1, a: 1 });
    const selectorStyle = { backgroundColor: bgColor.toHex8String() };

    React.useEffect(() => {
        if (toneSelectorRef.current) {
            setWidth(toneSelectorRef.current.clientWidth);
            setHeight(toneSelectorRef.current.clientHeight);

            const colorHsv = tinycolor.fromRatio(color).toHsv();

            setPointer([
                (colorHsv.s * width),
                height - (colorHsv.v * height)
            ]);
        }
    }, [width, height, props.color]);

    const pointerStyle = {
        left: `${pointer[0] - 6}px`,
        top: `${pointer[1] - 6}px`
    };

    const coordsToColor = (x, y, hue, alpha) => {
        const lx = clamp(x, 0, width);
        const ly = clamp(y, 0, height);

        const value = 1 - (ly / height);
        const saturation = lx / width;

        console.log({ h: hue, s: saturation, v: value, a: alpha });

        return { h: hue, s: saturation, v: value, a: alpha };
    };

    const getMeasures = (e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const elementX = bounds.x;
        const elementY = bounds.y;
        const startX = e.pageX;
        const startY = e.pageY;
        const positionX = startX - elementX;
        const positionY = startY - elementY;

        return {
            bounds,
            startX, startY,
            positionX, positionY
        };
    };

    const mouseDownHandler = (e) => {
        const {
            bounds,
            positionX, positionY
        } = getMeasures(e);

        e.stopPropagation();

        setDragging(true);
        setPointer([ positionX, positionY ]);

        props.onChange(coordsToColor(positionX, positionY, color.h, color.a));
    };

    const mouseMoveHandler = (e) => {
        if (e.buttons === 0) {
            setDragging(false);
            return true;
        }

        const {
            bounds,
            startX, startY,
            positionX, positionY
        } = getMeasures(e);

        if (!(dragging && startX >= bounds.left && startY >= bounds.top && startX <= bounds.left + width - 1 && startY <= bounds.top + height - 1)) return true;

        e.stopPropagation();

        setPointer([ positionX, positionY ]);

        props.onChange(coordsToColor(positionX, positionY, color.h, color.a));
    };

    const mouseUpHandler = (e) => {
        e.stopPropagation();
        setDragging(false);
    };

    return <>
        <div
            ref={toneSelectorRef}
            className="ToneSelector"
            style={selectorStyle}
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={mouseUpHandler}
            >
            <div className="TintOverlay">
                <div className="ShadeOverlay">
                    <div className="Pointer" style={pointerStyle}></div>
                </div>
            </div>
        </div>
    </>;
};

export default ToneSelector;