import React from 'react';

import Arrow from './Arrow';
import ConnectorProps from '../../../../types/Props';
import { Point } from '../../../../types/Point';

/**
 * Custom S shape svg connector
 * @param startPoint
 * @param endPoint
 * @param grids number of columns in X/Y axis
 * @param stem min distance from the start point to the first transition
 * @param roundCorner true to have a curve transition
 * @param minStep radius of the transition curve, default is min of (deltaX/grid, deltaY/grid)
 * @param arrowSize
 * @param endArrow
 * @param startArrow
 */

const BareConnector = (props: ConnectorProps) => {
    const {
        stroke,
        strokeWidth,
        startArrow, endArrow,
        startPoint, endPoint,
        arrowSize,
        roundCorner,
        minStep,
        coordsStart, coordsEnd,
        workArea,
        play, pause,
        svgClass,
        ...rest
    } = props;

    const startCoordinates = props.startPoint as Point;
    const endCoordinates = props.endPoint as Point;

    const distanceX = endCoordinates!.x - startCoordinates!.x;
    const distanceY = endCoordinates!.y - startCoordinates!.y;

    let stem = props.stem || 0;
    const grids = props.grids || 5;

    const radius = props.roundCorner ? 1 : 0;

    const stepX = distanceX / grids;
    const stepY = distanceY / grids;

    if (stem >= Math.abs(distanceX)) {
        stem = Math.abs(distanceX) - Math.abs(stepX);
    }

    let step = Math.min(Math.abs(stepX), Math.abs(stepY));

    step = Math.min(step, props.minStep || step);

    const adjustedArrowSize = props.arrowSize || (props.strokeWidth ? props.strokeWidth * 3 : 10);

    const netDistanceX = distanceX - 2 * stem - adjustedArrowSize;

    const halfX = netDistanceX / 2;
    const quarterX = netDistanceX / 4;
    const halfY = distanceY / 2;

    function corner12() {
        const path = `
            M ${startCoordinates!.x} ${startCoordinates!.y}
            h ${stem}
            q ${quarterX} 0 ${halfX} ${halfY}
            q ${quarterX} ${halfY} ${halfX} ${halfY}
            h ${stem}
        `;

        const strokeProp = !svgClass
            ? { stroke: props.stroke || "orange" }
            : null;

        const svgClassProp = svgClass
            ? { svgClass }
            : null;

        return (
            <svg className={`Connector ${svgClass}`} width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
                <path
                    {...rest}
                    {...strokeProp}
                    d={path}
                    strokeWidth={props.strokeWidth || 2}
                    fill='transparent'
                    />
                {
                    play
                        ? <path
                            {...rest}
                            {...strokeProp}
                            d={path}
                            strokeWidth={((props.strokeWidth || 0) + 2) || 4}
                            fill='transparent'
                            className={`active ${pause ? 'paused' : ''}`}
                            />
                        : null
                }
                {props.endArrow && (
                    <Arrow
                        {...strokeProp}
                        {...svgClassProp}
                        tip={endCoordinates}
                        size={adjustedArrowSize}
                        rotateAngle={0}
                        />
                )}
            </svg>
        );
    }

    function corner34() {
        const factor = distanceX * distanceY > 0 ? 1 : -1;

        let path = `
            M ${startCoordinates.x} ${startCoordinates.y}
            h ${stem}
            q ${step * radius} 0 ${step * radius} ${-step * factor * radius}
            v ${distanceY / 2 + step * 2 * factor * radius}
            q 0 ${-step * factor * radius} ${-step * radius} ${-step * factor * radius}
            h ${distanceX - stem * 2}
            q ${-step * radius} 0 ${-step * radius} ${-step * factor * radius}
            V ${endCoordinates.y + step * factor * radius}
            q 0 ${-step * factor * radius} ${step * radius} ${-step * factor * radius}
            H ${endCoordinates.x}
        `;

        const strokeProp = !svgClass
            ? { stroke: props.stroke || "orange" }
            : null;

        const svgClassProp = svgClass
            ? { svgClass }
            : null;

        return (
            <svg className={`Connector ${svgClass}`} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <path
                    {...rest}
                    {...strokeProp}
                    d={path}
                    strokeWidth={props.strokeWidth || 2}
                    fill="transparent"
                />
                {
                    play
                        ? <path
                            {...rest}
                            {...strokeProp}
                            d={path}
                            strokeWidth={((props.strokeWidth || 0) + 2) || 4}
                            fill="transparent"
                            className={`active ${pause ? 'paused' : ''}`}
                            />
                        : null
                }
                {props.endArrow && (
                    <Arrow
                        {...strokeProp}
                        {...svgClassProp}
                        tip={endCoordinates}
                        size={adjustedArrowSize}
                        rotateAngle={0}
                        />
                )}
            </svg>
        );
    }

    if (distanceX >= 0) return corner12();
    return corner34();
};

export default BareConnector;