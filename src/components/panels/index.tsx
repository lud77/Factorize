import textInput from './textInput';
import audio from './audio';

export default (getNextEndpointId) => ({
    TextInput: textInput(getNextEndpointId),
    Audio: audio(getNextEndpointId)
});