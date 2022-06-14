import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

export default (getNextEndpointId) => {
    const create = (title, { InputEndpoint, OutputEndpoint }): Panel => {
        const Component = (props) => {
            return <>
                <div className="Row">
                    <InputEndpoint name="Volume" panel={props.panel}>Volume</InputEndpoint>
                    <OutputEndpoint name="Audio" panel={props.panel}>Audio</OutputEndpoint>
                </div>
                <div className="Row">
                    <InputEndpoint name="Frequency" panel={props.panel}>Frequency</InputEndpoint>
                    <OutputEndpoint name="Whatev" panel={props.panel}>Whatev</OutputEndpoint>
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
            Component: Component
        };
    };

    return {
        create
    };
}