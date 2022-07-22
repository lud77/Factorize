import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import Led from '../../Led/Led';

const create = (panelId: number): Panel => {
    const Component = (props) => {

        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
            <div className="Row">
                {
                    (props.panel.inputEpValues.inputValue === undefined)
                        ? <>
                            <Led status="Inactive" />
                            <Led status="Inactive" />
                            <Led status="Inactive" />
                        </>
                        : <>
                            <Led status={props.panel.inputEpValues.inputValue ? 'Green' : 'Red'} />
                            <Led status={props.panel.inputEpValues.inputValue ? 'Green' : 'Red'} />
                            <Led status={props.panel.inputEpValues.inputValue ? 'Green' : 'Red'} />
                        </>
                }
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: undefined,
        signal: 'Value'
    }];

    const outputEndpoints = [];

    const execute = (panel, values) => values;

    return {
        type: 'Leds',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 89
    } as Panel;
};

export default {
    create
};