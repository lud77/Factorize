import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, setPanel, propagateValueAlong }) => (e) => {
        setPanel({
            ...panel,
            outputEpValues: {
                ...panel.outputEpValues,
                outputText: e.target.value
            }
        });

        propagateValueAlong(panel.outputRefs.outputText, e.target.value);

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <input
                        type="text"
                        onChange={handleChange(props)}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Text" panelId={panelId} {...props}>Text</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Text',
        defaultValue: ''
    }];

    const execute = () => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                console.log('TextInput');
                res(true);
            }, 2000);
        });
    };

    return {
        type: 'TextInput',
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