import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

import InputEndpointFactory from '../Editor/Panel/InputEndpoint';
import OutputEndpointFactory from '../Editor/Panel/OutputEndpoint';

export default (getNextEndpointId) => {
    const create = (title, isInputConnected, isOutputConnected, connectorAnchor): Panel => {
        const InputEndpoint = InputEndpointFactory(isInputConnected, connectorAnchor);
        const OutputEndpoint = OutputEndpointFactory(isOutputConnected, connectorAnchor);
                
        const Component = (props) => {
            return <>
                <div className="Title">{props.panel.title}</div>
                <div className="Row">
                    <InputEndpoint name="Volume" panel={props.panel}>Volume</InputEndpoint>
                    <OutputEndpoint name="Audio" panel={props.panel}>Audio</OutputEndpoint>
                </div>
                <div className="Row">
                    <InputEndpoint name="Frequency" panel={props.panel}>Frequency</InputEndpoint>
                    <OutputEndpoint name="Whatev" panel={props.panel}>Whatev</OutputEndpoint>
                </div>
                <div className="Row">
                    <div className="Input Item"><input type="text" /></div>
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