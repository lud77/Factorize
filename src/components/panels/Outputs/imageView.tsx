import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'ImageView';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}];

const outputEndpoints = [];

const panelSizes = {
    ...defaultSizes,
    height: 200,
    minHeight: 200
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const closeLightbox = () => props.setShowLightbox(null);
        const openLightbox = () => props.setShowLightbox({ url: props.panel.outputEpValues.imageData, close: closeLightbox });

        const backgroundStyle = {
            backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
            backgroundColor: '#ccc',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            overflow: 'hidden',
            width: '100%',
            display: 'block',
            marginTop: '2px',
            borderRadius: '5px'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
            </div>
            <div className="Row" style={backgroundStyle}>
                {
                    props.panel.inputEpValues.inputImage
                        ? <img
                            src={props.panel.outputEpValues.imageData}
                            style={{
                                width: '100%',
                                height: (props.panelCoord.height - 68) + 'px',
                                // backgroundColor: 'black',
                                borderRadius: '4px',
                                objectFit: 'contain'
                            }}
                            onClick={openLightbox}
                            />
                        : <div
                            style={{
                                width: '100%',
                                height: (props.panelCoord.height - 68) + 'px',
                                borderRadius: '4px'
                            }}
                            ></div>
                }
            </div>
        </>;
    };

    const execute = (panel, inputs, { setPanelCoords }) => {
        console.log('execute imageView', inputs);

        if (!inputs.inputImage) return { oldImage: null, imageData: '' };

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (inputs.inputImage != panel.outputEpValues.oldImage);

        const hasChanged = hasImageChanged;

        if (!hasChanged) return {};

        return {
            oldImage: inputs.inputImage,
            imageData: inputs.inputImage ? inputs.inputImage.contents.toDataURL() : ''
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute,
        resizer: 'both'
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['output'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;