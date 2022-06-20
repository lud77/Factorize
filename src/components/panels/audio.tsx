import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

import InputEndpoint from '../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../Editor/Panel/OutputEndpoint';

export default (getNextEndpointId) => {
    const create = (title, left = 0, top = 0): Panel => {
        const Component = (props) => {
            return <>
                <div className="Row">
                    <InputEndpoint name="Volume" {...props}>Volume</InputEndpoint>
                    <OutputEndpoint name="Audio" {...props}>Audio</OutputEndpoint>
                </div>
                <div className="Row">
                    <InputEndpoint name="Frequency" {...props}>Frequency</InputEndpoint>
                    <OutputEndpoint name="Whatev" {...props}>Whatev</OutputEndpoint>
                </div>
            </>;
        };

        const inputVolume = getNextEndpointId();
        const inputFrequency = getNextEndpointId();
        const outputAudio = getNextEndpointId();
        const outputWhatev = getNextEndpointId();

        return {
            type: 'Audio',
            title,
            refs: { inputVolume, inputFrequency, outputAudio, outputWhatev },
            Component,
            left,
            top
        };
    };

    return {
        create
    };
}