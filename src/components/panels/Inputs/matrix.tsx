import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Matrix';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Matrix',
    defaultValue: Matrix.zeroes(1, 1),
    type: 'matrix',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 55,
    minWidth: 155,
    height: 94
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const updateCell = (i, j) => (e) => {
            console.log(`value for matrix at ${i}, ${j} is ${e.target.value}`);

            if (!props.panel.outputEpValues.tuningMatrix) {
                props.panel.outputEpValues.tuningMatrix = Matrix.zeroes(i + 1, j + 1);
            }

            props.panel.outputEpValues.tuningMatrix.contents[i][j] = parseFloat(e.target.value);

            props.machine.executePanelLogic(panelId, { tuningMatrix: props.panel.outputEpValues.tuningMatrix });
        };

        const changeSize = (row, col) => (e) => {
            if (!props.panel.outputEpValues.tuningMatrix) {
                props.panel.outputEpValues.tuningMatrix = Matrix.zeroes(1, 1);
            }

            if (row > 0) {
                props.panel.outputEpValues.tuningMatrix.contents =
                    props.panel.outputEpValues.tuningMatrix.contents
                        .concat(Array(1).fill(Array(props.panel.outputEpValues.tuningMatrix.contents[0].length).fill(0)));
            }

            if (col > 0) {
                props.panel.outputEpValues.tuningMatrix.contents =
                    props.panel.outputEpValues.tuningMatrix.contents
                        .map((row, i) => props.panel.outputEpValues.tuningMatrix.contents[i].concat(Array(1).fill(0)));
            }

            if (row < 0 && props.panel.outputEpValues.tuningMatrix.contents.length > 1) {
                props.panel.outputEpValues.tuningMatrix.contents =
                    props.panel.outputEpValues.tuningMatrix.contents.slice(0, props.panel.outputEpValues.tuningMatrix.contents.length - 1);
            }

            if (col < 0 && props.panel.outputEpValues.tuningMatrix.contents[0].length > 1) {
                props.panel.outputEpValues.tuningMatrix.contents =
                    props.panel.outputEpValues.tuningMatrix.contents
                        .map((row, i) => props.panel.outputEpValues.tuningMatrix.contents[i].slice(0, props.panel.outputEpValues.tuningMatrix.contents[i].length - 1));
            }

            const height = 79 + 24 * Matrix.getHeight(props.panel.outputEpValues.tuningMatrix);
            const width = 18 + 50 * Matrix.getWidth(props.panel.outputEpValues.tuningMatrix);

            props.setPanelCoords((panelCoords) => {
                const panelCoord = panelCoords[panelId];

                return {
                    ...panelCoords,
                    [panelId]: {
                        ...panelCoord,
                        height,
                        minHeight: height,
                        width: width,
                        minWidth: 164
                    }
                };
            });

            props.machine.executePanelLogic(panelId, { tuningMatrix: props.panel.outputEpValues.tuningMatrix });
        };

        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button className="Button" style={{ width: '2.5em' }} onClick={changeSize(1, 0)}>+R</button>
                    <button className="Button" style={{ width: '2.5em', marginLeft: '2px' }} onClick={changeSize(-1, 0)}>-R</button>
                    <button className="Button" style={{ width: '2.5em', marginLeft: '12px' }} onClick={changeSize(0, 1)}>+C</button>
                    <button className="Button" style={{ width: '2.5em', marginLeft: '2px' }} onClick={changeSize(0, -1)}>-C</button>
                </div>
            </div>
            <div className="Row">
                <div className="InteractiveItem">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            props.panel.outputEpValues.outputMatrix.contents.map((row, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                                    {
                                        row.map((cell, j) => (
                                            <input key={`${i}-${j}`} type="number" step="any" defaultValue={cell} onChange={updateCell(i, j)} style={{ width: '50px' }} />
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Matrix" panelId={panelId} {...props}>Matrix</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (!values.tuningMatrix) return { outputResult: '' };

        const allNumbers = values.tuningMatrix.contents.reduce((a, row) => a && row.reduce((b, cell) => b && !isNaN(cell), true), true);

        console.log('execute matrix', values.tuningMatrix, allNumbers);

        if (!allNumbers) return { outputResult: '' };
        return { outputMatrix: values.tuningMatrix };
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
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['vector', 'tensor'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};