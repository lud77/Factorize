import { Point } from './Point';

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
