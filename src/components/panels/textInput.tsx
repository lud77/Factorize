import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

import InputEndpoint from '../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../Editor/Panel/OutputEndpoint';

const create = (title: string, panelId: number, left: number = 0, top: number = 0): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="Input Item"><input type="text" /></div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Text" panelId={panelId} {...props}>Text</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];
    const outputEndpoints = ['Text'];

    return {
        type: 'TextInput',
        title,
        inputEndpoints,
        outputEndpoints,
        Component,
        left,
        top
    } as Panel;
};

export default {
    create
};