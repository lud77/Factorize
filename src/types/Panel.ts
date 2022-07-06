export interface Panel {
    type: string;
    inputEndpoints: Array;
    outputEndpoints: Array;
    inputEpValues?: Array;
    outputEpValues?: Array;
    inputEpDefaults?: object;
    outputEpDefaults?: object;
    Component: JSX;
    execute: Function;
    starter?: boolean;
    title?: string;
    inputRefs?: object;
    inputRefsBy?: object;
    outputRefs?: object;
    left?: number;
    top?: number;
}