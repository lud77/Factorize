export interface PanelCoords {
    panelId: number;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    left: number;
    top: number;
    resizer: string;
    group?: Set<number>;
};