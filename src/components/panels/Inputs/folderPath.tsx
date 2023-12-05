import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import System from '../../../domain/System';

const panelType = 'FolderPath';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Path',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes
};

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        System.openFolderDialog()
            .then((filePath) => {
                if (filePath == null) return;

                machine.executePanelLogic(panelId, {
                    tuningFilePath: filePath
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
                <span onClick={handleClick(props)} style={style}>{props.panel.outputEpValues.outputPath || 'Select folder...'}</span>
            </div>
            <div className="Row">
                <OutputEndpoint name="Path" panelId={panelId} {...props}>Path</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        if (inputs.tuningFilePath) return { outputPath: inputs.tuningFilePath };

        return inputs;
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['input'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;