import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './memory';

describe('Memory panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText, getAllByText } = renderer;

        const valueEnpoints = getAllByText('Value');
        expect(valueEnpoints.length).toBe(2)

        const storeInput = getByText('Store');
        expect(storeInput).toBeInTheDocument();
    });
});
