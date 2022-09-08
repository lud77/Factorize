import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import { flushSync } from 'react-dom';

const panelType = 'ImageView';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}];

const outputEndpoints = [];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const closeLightbox = () => props.setShowLightbox(null);
        const openLightbox = () => props.setShowLightbox({ url: props.panel.outputEpValues.imageData, close: closeLightbox });

        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
            </div>
            <div className="Row">
                {
                    props.panel.inputEpValues.inputImage
                        ? <img
                            src={props.panel.outputEpValues.imageData}
                            style={{
                                width: '100%',
                                height: (props.panelCoord.height - 68) + 'px',
                                backgroundColor: 'black',
                                borderRadius: '4px',
                                objectFit: 'contain'
                            }}
                            onClick={openLightbox}
                            />
                        : null
                }
            </div>
        </>;
    };

    const execute = (panel, inputs, { setPanelCoords }) => {
        console.log('execute imageView', inputs);

        if (!inputs.inputImage) {

            flushSync(() => {
                setPanelCoords((panelCoords) => {
                    const updatePanelCoords = panelCoords[panel.panelId];

                    return {
                        ...panelCoords,
                        [panel.panelId]: {
                            ...updatePanelCoords,
                            height: 53,
                            minHeight: 53,
                            resizer: 'none'
                        }
                    };
                });
            });

            return {
                ...inputs,
                imageData: ''
            };
        }

        const { width, height } = inputs.inputImage;

        flushSync(() => {
            setPanelCoords((panelCoords) => {
                const updatePanelCoords = panelCoords[panel.panelId];

                return {
                    ...panelCoords,
                    [panel.panelId]: {
                        ...updatePanelCoords,
                        height: 200,
                        minHeight: 200,
                        resizer: 'both'
                    }
                };
            });
        });

        return {
            ...inputs,
            imageData: inputs.inputImage ? inputs.inputImage.toDataURL() : null
        };


        // if (inputs.inputImage == null) {
        //     setPanels((panels) => {
        //         const updatePanel = panels[panel.panelId];

        //         return {
        //             ...panels,
        //             [panel.panelId]: {
        //                 ...updatePanel,
        //                 height: 53
        //             }
        //         };
        //     });

        //     return inputs;
        // }

        // flushSync(() => {
        //     setPanels((panels) => {
        //         const updatePanel = panels[panel.panelId];

        //         return {
        //             ...panels,
        //             [panel.panelId]: {
        //                 ...updatePanel,
        //                 height: 109 + (111 * ((inputs.inputImage.height || 0) / (inputs.inputImage.width || 1)))
        //             }
        //         };
        //     });
        // });
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 53,
        minHeight: 53
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['output'],
    inputEndpoints,
    outputEndpoints
};