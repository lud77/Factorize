export interface Panel {
    type: string;
    title: string;
    inputRefs: object;
    outputRefs: object;
    Component: JSX;
    left: number;
    top: number;
}