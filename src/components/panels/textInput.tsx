import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

import InputEndpoint from '../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../Editor/Panel/OutputEndpoint';

export default (getNextEndpointId) => {
    const create = (title): Panel => {
        const Component = (props) => {
            return <>
                <div className="Row">
                    <div className="Input Item"><input type="text" /></div>
                </div>
                <div className="Row">
                    <OutputEndpoint name="Text" {...props}>Text</OutputEndpoint>
                </div>
            </>;
        };

        const outputText = getNextEndpointId();
        
        return { 
            type: 'TextInput', 
            title, 
            refs: { outputText },
            Component,
            x: 0,
            y: 0
        };
    };
    
    return {
        create
    };
}