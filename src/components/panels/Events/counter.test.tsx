import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './counter';

describe('Counter panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const eventInput = getByText('event');
        expect(eventInput).toBeInTheDocument();

        const resetInput = getByText('reset');
        expect(resetInput).toBeInTheDocument();

        const countOutput = getByText('Count');
        expect(countOutput).toBeInTheDocument();
    });
});