import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './fan';

describe('Fan panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText, getAllByText } = renderer;

        const inInput = getByText('In');
        expect(inInput).toBeInTheDocument()

        const outOutputs = getAllByText('Out');
        expect(outOutputs.length).toBe(2);
    });
});
