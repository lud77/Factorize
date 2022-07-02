import * as React from 'react';

import { Panel } from '../../Editor/Panel/types';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
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

    const outputEndpoints = [{
        name: 'Text'
    }];

    return {
        type: 'TextInput',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component
    } as Panel;
};

export default {
    create
};