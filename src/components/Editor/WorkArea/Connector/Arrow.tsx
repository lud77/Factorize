import React from "react";

import { ArrowProps } from '../../../../types/ArrowProps';

/**
 * Return an arrow path for svg
 * @param tip arrow tip point
 * @param size arrow size
 * @param stroke arrow filled color
 * @param rotateAngle arrow rotation angle, default = 0
 */

export default function Arrow(props: ArrowProps) {
    const path = `
        M ${props.tip.x} ${props.tip.y}
        l ${-props.size} ${-props.size / 2}
        v ${props.size}
        z
    `;

    const strokeProp = !props.svgClass
        ? { stroke: props.stroke, fill: props.stroke  }
        : null;

    return (
        <path
            className={`Arrow ${props.svgClass}`}
            d={path}
            fill={props.stroke}
            stroke={props.stroke}
            transform={`rotate(${props.rotateAngle || 0} ${props.tip.x} ${props.tip.y})`}
            />
    );
}