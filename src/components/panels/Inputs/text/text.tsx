import * as React from 'react';

import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Panel } from '../../../../types/Panel';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';

import './text.css';

const panelType = 'Text';

const create = (panelId: number): Panel => {
    const handleChangeText = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningText: e.target.value });

        return true;
    };

    const handleOpenClose = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningHide: !panel.inputEpValues.tuningHide });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className={`Row TextArea ${ props.panel.inputEpValues.tuningHide ? 'Close' : '' }`}>
                <textarea onChange={handleChangeText(props)} defaultValue={props.panel.outputEpValues.outputText} />
            </div>
            {/* <div className="TextAreaCloseButton">
                <button onClick={handleOpenClose(props)}>
                    {
                        props.panel.inputEpValues.tuningHide
                            ? <FontAwesomeIcon icon={solid('caret-down')} />
                            : <FontAwesomeIcon icon={solid('caret-up')} />
                    }
                </button>
            </div> */}
            <div className="Row">
                <OutputEndpoint name="Text" panelId={panelId} {...props}>Text</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Text',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        return {
            outputText: inputs.tuningText
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        width: 200,
        height: 200,
        minWidth: 120,
        minHeight: 120,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create
};