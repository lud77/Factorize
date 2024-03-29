import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/signal-formats/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'MatrixSum';

const inputEndpoints = [{
    name: 'Addend1',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}, {
    name: 'Addend2',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Result',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 94
};

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Addend`,
            `Addend${panel.addendEpsCounter}`,
            'matrix',
            null,
            'Value',
            null,
            'addendEps'
        );
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button className="Button" onClick={handleClick(props)}>+</button>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Addend1" panelId={panelId} {...props}>Addend</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Addend2" panelId={panelId} {...props}>Addend</InputEndpoint>
            </div>
            {
                props.panel.addendEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="addendEps" {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const execute = (panel, values) => {
        const eps = ['inputAddend1', 'inputAddend2'].concat(panel.addendEps.map(([ep]) => ep));

        const allMatrices = eps.reduce((a, ep) => a && values[ep] && values[ep].type == Matrix.matrixSym, true);

        if (!allMatrices) return { outputResult: null };
        const epsValues = eps.map((ep) => values[ep]);

        const w = Matrix.getWidth(epsValues[0]);
        const h = Matrix.getHeight(epsValues[0]);

        const allSameSize = epsValues.reduce((a, ep) => {
            const epW = Matrix.getWidth(ep);
            const epH = Matrix.getHeight(ep);

            return a && epW == w && epH == h;
        }, true);

        if (!allSameSize) return { outputResult: null };

        return { outputResult: epsValues.reduce((a, ep) => Matrix.sum(a, ep)) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        addendEps: [],
        addendEpsCounter: 3,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['algebra', 'matrix', 'matrices', 'addition'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;