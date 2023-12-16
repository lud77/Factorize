import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './button';

describe('Button panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const emitButton = getByText('Emit');
        expect(emitButton).toBeInTheDocument();

        const outputEndpoint = getByText('Send');
        expect(outputEndpoint).toBeInTheDocument();
    });

    it('should send a pulse when the button is triggered', () => {
        const { panel, machine, renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const emitButton = getByText('Emit');
        fireEvent.click(emitButton);
        expect(machine.sendPulseTo).toHaveBeenCalledWith(panel.panelId, 'outputSend');
    });
});