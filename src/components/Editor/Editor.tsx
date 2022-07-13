import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';
import Statusbar from './Statusbar/Statusbar';

import { ConnectorAnchor } from '../../types/ConnectorAnchor';
import { Connection } from '../../types/Machine';

import Machine from '../../domain/Machine';
import Walker from '../../domain/Walker';
import Palette from '../../domain/Palette';
import { toolbarMenus } from '../../domain/Menus';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

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

    const machine = Machine({
        props,
        panels, setPanels,
        connections, setConnections,
        workAreaOffset,
        getNextEndpointId: props.getNextEndpointId
    });

    const {
        makeConnection,
        makePanel,
        removeConnectionByOutputRef,
        removeConnectionByInputRef,
        propagateValueAlong
    } = machine;

    const walker = Walker({
        setPanels,
        connections, setConnections,
        play, setPlay,
        pause, setPause,
        machine
    });

    const { panelGroupPalette, flagPalette } = Palette(makePanel);

    const panelsMenu = panelGroupPalette(props.panelPalettes)

    const flagsMenu = flagPalette({
        'Grid': [grid, setGrid],
        'Snap': [snap, setSnap],
        'Inclusive Selection': [inclusiveSelection, setInclusiveSelection]
    });

    const menus = toolbarMenus({
        panels, setPanels, makePanel,
        play, pause,
        focused,
        panelsMenu, flagsMenu,
        walker
    });

    return (
        <div className={`Editor ${grid ? 'Gridded' : ''}`} style={{ backgroundPosition: `left ${workAreaOffset[0]}px top ${workAreaOffset[1]}px` }}>
            <Toolbar menus={menus} primary="Panels" />
            <WorkArea
                machine={machine}
                getNextEndpointId={props.getNextEndpointId}
                play={play} pause={pause}
                snap={snap}
                focused={focused} setFocus={setFocus}
                inclusiveSelection={inclusiveSelection}
                panels={panels} setPanels={setPanels}
                connections={connections} setConnections={setConnections}
                connectorAnchor={connectorAnchor} setConnectorAnchor={setConnectorAnchor}
                makeConnection={makeConnection}
                workAreaOffset={workAreaOffset} setWorkAreaOffset={setWorkAreaOffset}
                />;
            <Statusbar status="Ready" />
        </div>
    );
};

export default Editor;