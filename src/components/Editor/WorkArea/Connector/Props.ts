import { Point } from '../../../../types/Point';

export default interface Props extends React.SVGProps<SVGPathElement> {
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
        current: Element;
    };
    play?: boolean;
    pause?: boolean;
    startPoint?: Point;
    endPoint?: Point;
    svgClass?: string;
    draw?: number;
}
