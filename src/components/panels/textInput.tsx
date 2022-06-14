import Panel from './Panel';

export default (getNextEndpointId) => {
    const TextInput = (title): Panel => {
        const outputText = getNextEndpointId();
        
        return { 
            type: 'TextInput', 
            title, 
            refs: { outputText }
        };
    };
    
    return {
        TextInput
    };
}