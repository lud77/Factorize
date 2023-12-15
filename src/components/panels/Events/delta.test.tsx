import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './delta';

describe('Delta panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const valueInput = getByText('Value');
        expect(valueInput).toBeInTheDocument();

        const changedOutput = getByText('Changed');
        expect(changedOutput).toBeInTheDocument();
    });

    it('should send a pulse when the value changes', () => {
        const { panel, machine, renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const valueInput = getByText('Value');
        const changedOutput = getByText('Changed');

        panel.execute(panel, {}, machine);

        expect(machine.sendPulseTo).toHaveBeenCalledWith(panel.panelId, 'outputChanged');
    });
});