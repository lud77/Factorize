import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './deviator';

describe('Deviator panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText, getAllByText } = renderer;

        const storeAInput = getByText('Store A');
        expect(storeAInput).toBeInTheDocument()

        const storeBInput = getByText('Store B');
        expect(storeBInput).toBeInTheDocument();

        const AInput = getByText(/^A$/);
        expect(AInput).toBeInTheDocument();

        const BInput = getByText(/^B$/);
        expect(BInput).toBeInTheDocument();

        const valueOutputs = getByText('Value');
        expect(valueOutputs).toBeInTheDocument();
    });
});
