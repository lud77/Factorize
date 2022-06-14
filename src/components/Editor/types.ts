export interface DragCoords {
    el: Element;
    o: Point;
    c: Point;
}

export interface Point {
    x: number; 
    y: number;
}

export interface ConnectorAnchor {
    dragging: boolean;
    what?: string;
    fromRef?: Element;
    toRef?: Element;
    to?: Point;
    from?: Point;
}

export interface Connection {
    source: number;
    target: number;
}