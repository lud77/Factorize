import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './if';

describe('If panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const enableInput = getByText('Enable');
        expect(enableInput).toBeInTheDocument();

        const conditionInput = getByText('Condition');
        expect(conditionInput).toBeInTheDocument();

        const thenOutput = getByText('Then');
        expect(thenOutput).toBeInTheDocument();

        const elseOutput = getByText('Else');
        expect(elseOutput).toBeInTheDocument();
    });

    it('should forward a pulse through Then when condition is true', () => {
        const { panel, machine } = setupPanel(PanelBundle);

        const updates = panel.execute(panel, { inputCondition: true });

        const updatedPanel = {
            ...panel,
            inputEpValues: {
                ...panel.inputEpValues,
                ...updates
            }
        };

        updatedPanel.onPulse('inputEnable', updatedPanel, machine);
        expect(machine.sendPulseTo).toHaveBeenCalledWith(updatedPanel.panelId, 'outputThen');
    });

    it('should forward a pulse through Else when condition is false', () => {
        const { panel, machine } = setupPanel(PanelBundle);

        const updates = panel.execute(panel, { inputCondition: false });

        const updatedPanel = {
            ...panel,
            inputEpValues: {
                ...panel.inputEpValues,
                ...updates
            }
        };

        updatedPanel.onPulse('inputEnable', updatedPanel, machine);
        expect(machine.sendPulseTo).toHaveBeenCalledWith(updatedPanel.panelId, 'outputElse');
    });
});