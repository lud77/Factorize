import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './any';

describe('Any panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText, getAllByText } = renderer;

        const inInputs = getAllByText('In');
        expect(inInputs.length).toBe(2)

        const outOutput = getByText('Out');
        expect(outOutput).toBeInTheDocument();
    });

    it('should send a pulse when the any input receivs a pulse', () => {
        const { panel, machine } = setupPanel(PanelBundle);

        panel.onPulse('inputIn1', panel, machine);
        expect(machine.sendPulseTo).toHaveBeenCalledWith(panel.panelId, 'outputOut');

        panel.onPulse('inputIn2', panel, machine);
        expect(machine.sendPulseTo).toHaveBeenCalledWith(panel.panelId, 'outputOut');
    });
});