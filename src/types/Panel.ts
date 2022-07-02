export interface Panel {
    type: string;
    inputEndpoints: Array;
    outputEndpoints: Array;
    Component: JSX;
    execute: Function;
    starter?: boolean;
    title?: string;
    inputRefs?: object;
    outputRefs?: object;
    left?: number;
    top?: number;
}