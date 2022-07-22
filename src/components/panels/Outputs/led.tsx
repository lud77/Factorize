import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        // const displayStyle = {
        //     height: '36px',
        //     textAlign: 'center',
        //     width: '36px',
        //     borderRadius: '50%',
        //     margin: '0 auto',
        //     backgroundColor: props.panel.inputEpValues.inputValue ? 'green' : 'red',
        //     display: 'inline-block'
        // };



        const greenDisplayStyle = {
            margin: '0 auto',
            width: '36px',
            height: '36px',
            backgroundColor: '#ABFF00',
            borderRadius: '50%',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89FF00 0 2px 12px'
        };

        const redDisplayStyle = {
            margin: '0 auto',
            width: '36px',
            height: '36px',
            backgroundColor: 'red',
            borderRadius: '50%',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
            <div className="Row">
                <span style={props.panel.inputEpValues.inputValue ? greenDisplayStyle : redDisplayStyle}>&nbsp;</span>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: false,
        signal: 'Value'
    }];

    const outputEndpoints = [];

    const execute = (panel, values) => values;

    return {
        type: 'Led',
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