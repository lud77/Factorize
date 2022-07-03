import { Point } from './Point';

interface AnchorPoint {
    panelId: number;
    o: Point;
}

interface AnchorPoints extends Array<AnchorPoint>{}

export interface DragCoords {
    isDragging: boolean;
    what?: string;
    el?: Element;
    o?: Point;
    os?: AnchorPoints;
    c?: Point;
}