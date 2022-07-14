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