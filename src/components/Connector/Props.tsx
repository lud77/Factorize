import React from "react";

export interface Point {
    x: number;
    y: number;
}

export interface ShapeConnectorProps extends React.SVGProps<SVGPathElement> {
    startPoint: Point;
    endPoint: Point;
    stroke?: string;
    strokeWidth?: number;
    startArrow?: boolean;
    endArrow?: boolean;
    arrowSize?: number;
}

export interface Props extends React.SVGProps<SVGPathElement> {
    el1?: HTMLDivElement;
    el2?: HTMLDivElement;
    coordsStart?: { 
        x: number; 
        y: number;
    };
    coordsEnd?: { 
        x: number; 
        y: number;
    };
    grids?: number;
    stem?: number;
    roundCorner?: boolean;
    stroke?: string;
    strokeWidth?: number;
    minStep?: number;
    startArrow?: boolean;
    endArrow?: boolean;
    arrowSize?: number;
}
