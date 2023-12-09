import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './button';

test('Render button panel component', () => {
    const { panel, machine, renderer } = setupPanel(PanelBundle);

    const emitButton = renderer.getByText('Emit');
    expect(emitButton).toBeInTheDocument();

    fireEvent.click(emitButton);

    expect(machine.sendPulseTo).toHaveBeenCalledWith(panel.panelId, 'outputSend');

    const outputEndpoint = renderer.getByText('Send');
    expect(outputEndpoint).toBeInTheDocument();
});
