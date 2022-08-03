import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import { hex2rgb, hex2hsl } from '../../../utils/colors';

import './colorPicker.css';

const panelType = 'ColorPicker';

const create = (panelId: number): Panel => {
    const getRedComponent = (hex) => {
        const [red] = hex2rgb(hex);
        return red;
    };

    const getGreenComponent = (hex) => {
        const [, green] = hex2rgb(hex);
        return green;
    };

    const getBlueComponent = (hex) => {
        const [, , blue] = hex2rgb(hex);
        return blue;
    };

    const getHueComponent = (hex) => {
        const [hue] = hex2hsl(hex);
        return hue;
    };

    const getSaturationComponent = (hex) => {
        const [, saturation] = hex2hsl(hex);
        return saturation;
    };

    const getLuminosityComponent = (hex) => {
        const [, , luminosity] = hex2hsl(hex);
        return luminosity;
    };

    const handleChange = ({ panel, machine }) => (e) => {
        console.log('new color', e.target.value);
        machine.executePanelLogic(panelId, { tuningColor: e.target.value });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <div className="ColorPicker">
                        <input
                            type="color"
                            onChange={handleChange(props)}
                            value={ props.panel.outputEpValues.outputHex }
                            />
                    </div>
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Hex" panelId={panelId} {...props}>Hex</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Red" panelId={panelId} {...props}>Red</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Green" panelId={panelId} {...props}>Green</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Blue" panelId={panelId} {...props}>Blue</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Hue" panelId={panelId} {...props}>Hue</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Saturation" panelId={panelId} {...props}>Saturation</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Luminosity" panelId={panelId} {...props}>Luminosity</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Hex',
        defaultValue: '#ffffff',
        signal: 'Value'
    }, {
        name: 'Red',
        defaultValue: 255,
        signal: 'Value'
    }, {
        name: 'Green',
        defaultValue: 255,
        signal: 'Value'
    }, {
        name: 'Blue',
        defaultValue: 255,
        signal: 'Value'
    }, {
        name: 'Hue',
        defaultValue: 0,
        signal: 'Value'
    }, {
        name: 'Saturation',
        defaultValue: 0,
        signal: 'Value'
    }, {
        name: 'Luminosity',
        defaultValue: 100,
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        return {
            outputHex: inputs.tuningColor,
            outputRed: getRedComponent(inputs.tuningColor),
            outputGreen: getGreenComponent(inputs.tuningColor),
            outputBlue: getBlueComponent(inputs.tuningColor),
            outputHue: getHueComponent(inputs.tuningColor),
            outputSaturation: getSaturationComponent(inputs.tuningColor),
            outputLuminosity: getLuminosityComponent(inputs.tuningColor)
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 209
    } as Panel;
};

export default {
    type: panelType,
    create
};