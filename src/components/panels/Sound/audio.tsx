import * as React from 'react';

import { Panel } from '../../Editor/Panel/types';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
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

    const inputEndpoints = [{
        name: 'Volume',
        defaultValue: 0
    }, {
        name: 'Frequency',
        defaultValue: 1
    }];

    const outputEndpoints = [{
        name: 'Audio'
    }, {
        name: 'Whatev'
    }];

    return {
        type: 'Audio',
        inputEndpoints,
        outputEndpoints,
        Component
    } as Panel;
};

export default {
    create
};
