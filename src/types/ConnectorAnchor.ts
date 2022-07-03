import { Point } from './Point';

export interface ConnectorAnchor {
    fromRef: Element;
    toRef: Element;
    to: Point;
    from: Point;
    fromPanelId?: number;
    toPanelId?: number;
}
