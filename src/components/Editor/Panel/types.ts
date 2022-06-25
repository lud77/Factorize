export interface Panel {
    type: string;
    title: string;
    inputRefs?: object;
    outputRefs?: object;
    inputEndpoints: Array;
    outputEndpoints: Array;
    Component: JSX;
    left: number;
    top: number;
}