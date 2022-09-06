import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'FilePath';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Path',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        System.saveFileDialog({ title: 'Select file...' })
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
                <span onClick={handleClick(props)} style={style}>{props.panel.outputEpValues.outputPath || 'Select file...'}</span>
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
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['input'],
    inputEndpoints,
    outputEndpoints
};