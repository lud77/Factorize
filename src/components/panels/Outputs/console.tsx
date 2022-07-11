import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Text" panelId={panelId} {...props}>Text</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Text',
        defaultValue: ''
    }];

    const outputEndpoints = [];

    const execute = (values) => {
        return Promise.resolve()
            .then(() => {
                console.log(values.Text);
            });
    };

    return {
        type: 'Console',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute
    } as Panel;
};

export default {
    create
};