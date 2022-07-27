import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';
import Statusbar from './Statusbar/Statusbar';

import { ConnectorAnchor } from '../../types/ConnectorAnchor';
import { Connection } from '../../types/Connection';

import Machine from '../../domain/Machine';
import Walker from '../../domain/Walker';
import Documents from '../../domain/Documents';
import Palette from '../../domain/Palette';
import { toolbarMenusSetup } from '../../domain/Menus';
import getSequence from '../../utils/sequence';
import { Timers } from '../../utils/timers';
import panelPalettes from '../../components/panels';
import dictionary from '../../components/panels/dictionary';

import './Editor.css';

const panelIdSequence = getSequence();
const getNextPanelId = panelIdSequence.next;

const endpointIdSequence = getSequence();
const getNextEndpointId = endpointIdSequence.next;

const timers = Timers();

const Editor = (props) => {
    const [ snap, setSnap ] = React.useState<boolean>(false);
    const [ grid, setGrid ] = React.useState<boolean>(true);
    const [ inclusiveSelection, setInclusiveSelection ] = React.useState<boolean>(true);

    const [ play, setPlay ] = React.useState<boolean>(false);
    const [ pause, setPause ] = React.useState<boolean>(false);

    const [ focused, setFocus ] = React.useState<number | null>(null);
    const [ panels, setPanels ] = React.useState<object>({});
	const [ connections, setConnections ] = React.useState<Connection[]>([]);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
    const [ workAreaOffset, setWorkAreaOffset ] = React.useState([0, 0]);

    const documents = Documents({
        setPanels,
        setConnections,
        filePath: props.filePath, setFilePath: props.setFilePath,
        panelIdSequence,
        endpointIdSequence,
        clearAllTimers: timers.clearAllTimers
    });

    const machine = Machine({
        dictionary,
        panels, setPanels,
        connections, setConnections,
        workAreaOffset,
        getNextPanelId,
        getNextEndpointId,
        timers
    });

    const {
        makeConnection,
        addPanel
    } = machine;

    const walker = Walker({
        setPanels,
        connections, setConnections,
        play, setPlay,
        pause, setPause,
        machine
    });

    const { panelGroupPalette, flagPalette } = Palette(addPanel);

    const panelsMenu = panelGroupPalette(panelPalettes)

    const flagsMenu = flagPalette({
        'Grid': [grid, setGrid],
        'Snap': [snap, setSnap],
        'Inclusive Selection': [inclusiveSelection, setInclusiveSelection]
    });

    const menus = toolbarMenusSetup({
        panels, setPanels,
        connections, setConnections,
        play, pause,
        focused,
        walker,
        documents,
        flagsMenu, panelsMenu
    });

    return (
        <div className={`Editor ${grid ? 'Gridded' : ''}`} style={{ backgroundPosition: `left ${workAreaOffset[0]}px top ${workAreaOffset[1]}px` }}>
            <Toolbar menus={menus} primary="Panels" />
            <WorkArea
                machine={machine}
                getNextEndpointId={getNextEndpointId}
                play={play} pause={pause}
                snap={snap}
                focused={focused} setFocus={setFocus}
                inclusiveSelection={inclusiveSelection}
                panels={panels} setPanels={setPanels}
                connections={connections} setConnections={setConnections}
                connectorAnchor={connectorAnchor} setConnectorAnchor={setConnectorAnchor}
                makeConnection={makeConnection}
                workAreaOffset={workAreaOffset} setWorkAreaOffset={setWorkAreaOffset}
                setTimer={timers.setTimer}
                />;
            <Statusbar status="Ready" />
        </div>
    );
};

export default Editor;