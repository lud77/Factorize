import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './button';

test('Render button panel component', () => {
    const { panel, machine, renderer } = setupPanel(PanelBundle);

    // Test the existence of the button with text "Emit"
    const emitButton = renderer.getByText('Emit');
    expect(emitButton).toBeInTheDocument();

    // Trigger a click event on the button
    fireEvent.click(emitButton);

    // Check if sendPulseTo was called with the correct arguments
    expect(machine.sendPulseTo).toHaveBeenCalledWith(panel.panelId, 'outputSend');

    // You might need to adjust the selector based on your actual implementation
    const outputEndpoint = renderer.getByText('Send');
    expect(outputEndpoint).toBeInTheDocument();
});
