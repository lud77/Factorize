export interface DragCoords {
    isDragging: boolean;
    what?: string;
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
    fromPanelId?: number;
    toPanelId?: number;
}

export interface Connection {
    source: number;
    target: number;
    sourcePanelId: number;
    targetPanelId: number;
}