import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

import InputEndpoint from '../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../Editor/Panel/OutputEndpoint';

export default (getNextEndpointId) => {
    const create = (title: string, left: number = 0, top: number = 0): Panel => {
        const Component = (props) => {
            return <>
                <div className="Row">
                    <div className="Input Item"><input type="text" /></div>
                </div>
                <div className="Row">
                    <OutputEndpoint name="Text" {...props}>Text</OutputEndpoint>
                </div>
            </>;
        };

        const outputText = getNextEndpointId();

        return {
            type: 'TextInput',
            title,
            inputRefs: {},
            outputRefs: { outputText },
            Component,
            left,
            top
        } as Panel;
    };

    return {
        create
    };
}