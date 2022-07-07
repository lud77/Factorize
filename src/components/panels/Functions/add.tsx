import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Addend1" panelId={panelId} {...props}>Addend 1</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Addend2" panelId={panelId} {...props}>Addend 2</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Addend1',
        defaultValue: 0
    }, {
        name: 'Addend2',
        defaultValue: 0
    }];

    const outputEndpoints = [{
        name: 'Result',
        default: undefined
    }];

    const execute = (values) => {
        if (!values.Addend1) return;
        if (!values.Addend2) return;
        return Promise.resolve(values.Addend1 + values.Addend2);
    };

    return {
        type: 'Value',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 84,
        Component,
        execute
    } as Panel;
};

export default {
    create
};