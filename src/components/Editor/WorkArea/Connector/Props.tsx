import React from "react";

export interface Point {
    x: number;
    y: number;
}

export interface ConnectorProps extends React.SVGProps<SVGPathElement> {
    startPoint: Point;
    endPoint: Point;
    stroke?: string;
    strokeWidth?: number;
    startArrow?: boolean;
    endArrow?: boolean;
    arrowSize?: number;
    grids?: number;
    stem?: number;
    roundCorner?: boolean;
    minStep?: number;
    coordsStart?: object;
    coordsEnd?: object;
    workArea?: object;
    play?: boolean;
    pause?: boolean;
}

export interface Props extends React.SVGProps<SVGPathElement> {
    el1?: HTMLDivElement;
    el2?: HTMLDivElement;
    coordsStart?: Point;
    coordsEnd?: Point;
    grids?: number;
    stem?: number;
    roundCorner?: boolean;
    stroke?: string;
    strokeWidth?: number;
    minStep?: number;
    startArrow?: boolean;
    endArrow?: boolean;
    arrowSize?: number;
    workArea: {
        current: object;
    };
    play?: boolean;
    pause?: boolean;
}

export interface ArrowProps {
    tip: Point;
    size: number;
    stroke?: string;
    rotateAngle?: number;
}
