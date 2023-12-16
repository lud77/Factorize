import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './clock';

describe('Clock panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const activeInput = getByText('Active');
        expect(activeInput).toBeInTheDocument();

        const secondsInput = getByText('Seconds');
        expect(secondsInput).toBeInTheDocument();

        const tickOutput = getByText('Tick');
        expect(tickOutput).toBeInTheDocument();
    });
});