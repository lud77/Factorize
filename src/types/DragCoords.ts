import { Point } from './Point';

interface AnchorPoint {
    panelId: number;
    o: Point;
}

export interface DragCoords {
    isDragging: boolean;
    what?: string;
    el?: Element;
    o?: Point;
    os?: AnchorPoint[];
    c?: Point;
}