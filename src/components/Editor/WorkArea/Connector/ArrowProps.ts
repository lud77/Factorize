import { Point } from '../../../../types/Point';

export interface ArrowProps {
    tip: Point;
    size: number;
    stroke?: string;
    rotateAngle?: number;
    svgClass?: string;
}