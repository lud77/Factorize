import { Point } from './Point';

export interface DragCoords {
    isDragging: boolean;
    what?: string;
    el?: Element;
    o?: Point;
    c?: Point;
}