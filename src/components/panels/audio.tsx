import Panel from './Panel';

export default (getNextEndpointId) => {
    const Audio = (title): Panel => {
        const inputVolume = getNextEndpointId();
        const inputFrequency = getNextEndpointId();
        const outputAudio = getNextEndpointId();
        const outputWhatev = getNextEndpointId();
        
        return { 
            type: 'Audio', 
            title, 
            refs: { inputVolume, inputFrequency, outputAudio, outputWhatev }
        };
    };
    
    return {
        Audio
    };
}