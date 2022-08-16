import * as React from 'react';

import functionPlot from 'function-plot';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Plotter';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const displayStyle = {
            fontFamily: 'courier',
            fontSize: `15px`,
            lineHeight: `15px`,
            overflow: 'hidden',
            width: '100%',
            backgroundColor: 'var(--background)',
            flexGrow: 1,
            display: 'block',
            marginTop: '2px',
            borderRadius: '5px'
        };

        const plotterRef = React.useRef();

        React.useEffect(() => {
            let contentsBounds = plotterRef.current.getBoundingClientRect();
            let width = contentsBounds.width;
            let height = contentsBounds.height;

            functionPlot({
                target: plotterRef.current,
                disableZoom: true,
                width,
                height,
                xAxis: { domain: [props.panel.inputEpValues.inputMinX, props.panel.inputEpValues.inputMaxX] },
                yAxis: { domain: [props.panel.inputEpValues.inputMinY, props.panel.inputEpValues.inputMaxY] },
                grid: true,
                data: [
                  {
                    fn: props.panel.inputEpValues.inputFunction,
                    derivative: {
                      fn: "cos(x)",
                      updateOnMouseMove: true
                    }
                  },
                  {
                    fn: "cos(x)",
                    derivative: {
                      fn: "-sin(x)",
                      updateOnMouseMove: true
                    }
                  }
                ]
              });
        });

        return <>
            <div className="Row">
                <InputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="MinX" panelId={panelId} signal="Value" {...props}>Min X</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="MaxX" panelId={panelId} signal="Value" {...props}>Max X</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="MinY" panelId={panelId} signal="Value" {...props}>Min Y</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="MaxY" panelId={panelId} signal="Value" {...props}>Max Y</InputEndpoint>
            </div>
            <div className="Row" style={displayStyle} ref={plotterRef}></div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Function',
        defaultValue: 'sin(x)',
        type: 'function',
        signal: 'Value'
    }, {
        name: 'MinX',
        defaultValue: -10,
        type: 'number',
        signal: 'Value'
    }, {
        name: 'MaxX',
        defaultValue: 10,
        type: 'number',
        signal: 'Value'
    }, {
        name: 'MinY',
        defaultValue: -10,
        type: 'number',
        signal: 'Value'
    }, {
        name: 'MaxY',
        defaultValue: 10,
        type: 'number',
        signal: 'Value'
    }];

    const outputEndpoints = [];

    const execute = (panel, inputs) => {
        return inputs;
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        width: 300,
        height: 300,
        minWidth: 150,
        minHeight: 200,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create
};