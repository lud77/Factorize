export interface Connection {
    source: number;
    target: number;
    sourcePanelId: number;
    targetPanelId: number;
    active: boolean;
    signal: string;
}