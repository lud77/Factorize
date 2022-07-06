import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Value',
        defaultValue: 5
    }];

    const execute = () => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                console.log('Value');
                res(true);
            }, 2000);
        });
    };

    return {
        type: 'Value',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 64,
        Component,
        execute
    } as Panel;
};

export default {
    create
};