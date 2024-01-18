import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './delay';

describe('Delay panel component', () => {
    it('should be rendered', () => {
        const { renderer } = setupPanel(PanelBundle);
        const { getByText } = renderer;

        const inInput = getByText('In');
        expect(inInput).toBeInTheDocument()

        const outOutput = getByText('Out');
        expect(outOutput).toBeInTheDocument();

        const secondsInput = getByText('Seconds');
        expect(secondsInput).toBeInTheDocument();
    });
});
