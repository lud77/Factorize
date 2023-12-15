import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './all';

describe('All panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText, getAllByText } = renderer;

        const resetInput = getByText('Reset');
        expect(resetInput).toBeInTheDocument();

        const inInputs = getAllByText('In');
        expect(inInputs.length).toBe(2)

        const outOutput = getByText('Out');
        expect(outOutput).toBeInTheDocument();
    });

    it('should send a pulse when the all the inputs have received a pulse', () => {
        const { panel, machine } = setupPanel(PanelBundle);

        const updates = panel.onPulse('inputIn1', panel, machine);
        expect(machine.sendPulseTo).toHaveBeenCalledTimes(0);

        console.log(panel);

        const updatedPanel = {
            ...panel,
            outputEpValues: {
                ...panel.outputEpValues,
                ...updates
            }
        };

        updatedPanel.onPulse('inputIn2', updatedPanel, machine);
        expect(machine.sendPulseTo).toHaveBeenCalledWith(updatedPanel.panelId, 'outputOut');
    });
});