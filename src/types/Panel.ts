export interface Panel {
    type: string;
    panelId?: number;
    inputEndpoints: Array<{ name: string, defaultValue: any, type: string, signal: string }>;
    outputEndpoints: Array<{ name: string, defaultValue: any, type: string, signal: string }>;
    inputEpValues?: Array;
    outputEpValues?: Array;
    inputEpDefaults?: object;
    outputEpDefaults?: object;
    Component: React.FC;
    execute: Function;
    starter?: boolean;
    title?: string;
    inputRefs?: object;
    inputRefsBy?: object;
    outputRefs?: object;
    left?: number;
    top?: number;
    expunge: Array<any>;
    width: number;
    height: number;
}