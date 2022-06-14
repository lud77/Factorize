export interface DragCoords {
    isDragging: boolean;
    el?: Element;
    o?: Point;
    c?: Point;
}

export interface Point {
    x: number; 
    y: number;
}

export interface ConnectorAnchor {
    fromRef: Element;
    toRef: Element;
    to: Point;
    from: Point;
}

export interface Connection {
    source: number;
    target: number;
}