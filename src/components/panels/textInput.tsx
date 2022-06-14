import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

import InputEndpointFactory from '../Editor/Panel/InputEndpoint';
import OutputEndpointFactory from '../Editor/Panel/OutputEndpoint';

export default (getNextEndpointId) => {
    const TextInput = (title, isInputConnected, isOutputConnected, connectorAnchor): Panel => {
        const InputEndpoint = InputEndpointFactory(isInputConnected, connectorAnchor);
        const OutputEndpoint = OutputEndpointFactory(isOutputConnected, connectorAnchor);

        const outputText = getNextEndpointId();
        
        return { 
            type: 'TextInput', 
            title, 
            refs: { outputText },
            Component: () => (<></>)
        };
    };
    
    return {
        TextInput
    };
}