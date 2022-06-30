import * as React from 'react';

import { Panel } from '../../Editor/Panel/types';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (title: string, panelId: number, left: number = 0, top: number = 0): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Volume" panelId={panelId} {...props}>Volume</InputEndpoint>
                <OutputEndpoint name="Audio" panelId={panelId} {...props}>Audio</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Frequency" panelId={panelId} {...props}>Frequency</InputEndpoint>
                <OutputEndpoint name="Whatev" panelId={panelId} {...props}>Whatev</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = ['Volume', 'Frequency'];
    const outputEndpoints = ['Audio', 'Whatev'];

    return {
        type: 'Audio',
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
