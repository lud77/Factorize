import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const { ipcRenderer } = window.require('electron');

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        ipcRenderer.send('api:select-file', '');
        ipcRenderer.once('api:file-path', (e, msg) => {
            if (msg.cancelled) return;

            machine.executePanelLogic(panelId, {
                tuningFilePath: msg.path
            });
        });

        return true;
    };

    const Component = (props) => {
        const style = {
            padding: '0px 4px',
            marginBottom: '4px',
            borderRadius: '4px',
            backgroundColor: 'var(--background)',
            height: 'calc(1em + 16px)',
            lineHeight: 'calc(1em + 16px)',
            overflow: 'hidden',
            width: '100%',
            textOverflow: 'clip'
        };

        return <>
            <div className="Row">
                <span onClick={handleClick(props)} style={style}>{props.panel.outputEpValues.outputPath || 'Select file...'}</span>
            </div>
            <div className="Row">
                <OutputEndpoint name="Path" panelId={panelId} {...props}>Path</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Path',
        defaultValue: '',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        return { outputPath: inputs.tuningFilePath };
    };

    return {
        type: 'File',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute
    } as Panel;
};

export default {
    create
};