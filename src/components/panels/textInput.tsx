import * as React from 'react';

import { Panel } from '../Editor/Panel/types';

export default (getNextEndpointId) => {
    const create = (title, { InputEndpoint, OutputEndpoint }): Panel => {
        const Component = (props) => {
            return <>
                <div className="Row">
                    <div className="Input Item"><input type="text" /></div>
                </div>
                <div className="Row">
                    <OutputEndpoint name="Text" panel={props.panel}>Text</OutputEndpoint>
                </div>
            </>;
        };

        const outputText = getNextEndpointId();
        
        return { 
            type: 'TextInput', 
            title, 
            refs: { outputText },
            Component: Component
        };
    };
    
    return {
        create
    };
}