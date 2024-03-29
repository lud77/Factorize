import React from 'react';
import { render } from '@testing-library/react';

import Sequence from '../../../utils/sequence';
import makePanelFactory from '../../../domain/MakePanel';

const setupPanel = (PanelBundle) => {
    const getNextPanelId = Sequence().next;
    const getNextEndpointId = Sequence().next;

    let position = 0;
    const workAreaOffset = 0;

    const makePanel = makePanelFactory(
        { [PanelBundle.type]: PanelBundle },
        getNextPanelId,
        getNextEndpointId,
        position,
        workAreaOffset
    );

    const [ panel ]: [any, any] = makePanel(PanelBundle.type);

    const mockSendPulseTo = jest.fn();
    const setPanels = jest.fn();
    const setPanelCoords = jest.fn();
    const setShowLightbox = jest.fn();
    const panelCoord = {};
    const connections = [];
    const connectorAnchor = {};

    const machine = {
        sendPulseTo: mockSendPulseTo
    };

    const renderer = render(
        <panel.Component
            panel={panel}
            setPanels={setPanels}
            panelCoord={panelCoord}
            setPanelCoords={setPanelCoords}
            machine={machine}
            connections={connections}
            connectorAnchor={connectorAnchor}
            setShowLightbox={setShowLightbox}
        />
    );

    return {
        panel,
        renderer,
        machine
    };
};

export default setupPanel;