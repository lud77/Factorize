export interface Panel {
    type: string;
    title: string;
    refs: object;
    Component: JSX.Element;
}