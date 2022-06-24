import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import getSequence from '../../utils/sequence';

import { ConnectorAnchor, Connection } from './types';
import { Panel } from './Panel/types';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

let position = 10;

const Editor = (props) => {
    const [panelIdByInputEndpointId, setPanelIdByInputEndpointId] = React.useState({});
    const [panelIdByOutputEndpointId, setPanelIdByOutputEndpointId] = React.useState({});

    const makeConnection = (source, target): Connection =>
        ({
            source,
            target
        });

    const makePanel = (type) => {
        const panelId = props.getNextPanelId();
        const panel = props.panels[type].create(`${type} ${panelId}`, position, position);
        position += 20;

        const inputIndex = panelIdByInputEndpointId;
        const outputIndex = panelIdByOutputEndpointId;

        Object.values(panel.inputRefs)
            .forEach((endpointId) => {
                inputIndex[endpointId] = panelId;
            });

        Object.values(panel.outputRefs)
            .forEach((endpointId) => {
                outputIndex[endpointId] = panelId
            });

        setPanelIdByInputEndpointId(inputIndex);
        setPanelIdByOutputEndpointId(outputIndex);

        setPanels([...panels, {
            ...panel,
            panelId,
            width: 120,
            height: 70
        }]);
    };

    const toolbar = React.useRef<any>();

    const [ snap, setSnap ] = React.useState<boolean>(false);
    const [ grid, setGrid ] = React.useState<boolean>(true);
    const [ inclusiveSelection, setInclusiveSelection ] = React.useState<boolean>(true);

    const [ panels, setPanels ] = React.useState<Panel[]>([]);
	const [ connections, setConnections ] = React.useState<Connection[]>([]);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
    const [ workAreaOffset, setWorkAreaOffset ] = React.useState([0, 0]);

    const menus = {
        'Panels': {
            'Audio': {
                execute: () => makePanel('Audio')
            },
            'TextInput': {
                execute: () => makePanel('TextInput')
            }
        },
        'Options': {
            'Grid': {
                execute: (item) => {
                    setGrid(!grid);
                },
                active: grid
            },
            'Snap': {
                execute: (item) => {
                    setSnap(!snap);
                },
                active: snap
            },
            'Inclusive Selection': {
                execute: (item) => {
                    setInclusiveSelection(!inclusiveSelection);
                },
                active: inclusiveSelection
            }
        }
    };

    return (
        <div className={`Editor ${grid ? 'Gridded' : ''}`} style={{ backgroundPosition: `left ${workAreaOffset[0]}px top ${workAreaOffset[1]}px` }}>
            <Toolbar
                toolbar={toolbar}
                menus={menus} default="Panels"
                />
            <WorkArea
                toolbar={toolbar}
                snap={snap}
                inclusiveSelection={inclusiveSelection}
                panels={panels} setPanels={setPanels}
                connections={connections} setConnections={setConnections}
                connectorAnchor={connectorAnchor} setConnectorAnchor={setConnectorAnchor}
                makeConnection={makeConnection}
                workAreaOffset={workAreaOffset} setWorkAreaOffset={setWorkAreaOffset}
                panelIdByInputEndpointId={panelIdByInputEndpointId} panelIdByOutputEndpointId={panelIdByOutputEndpointId}
                />;
        </div>
    );
};

export default Editor;