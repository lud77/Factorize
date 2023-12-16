import '@testing-library/jest-dom';

import setupPanel from '../utils/panelTestUtils';
import PanelBundle from './accumulator';

test('Accumulator panel component should render', () => {
    const { renderer } = setupPanel(PanelBundle);
    const { getByText } = renderer;

    const eventInput = getByText('Event');
    const valueInput = getByText('Value');
    const resetInput = getByText('Reset');
    const countOutput = getByText('Count');

    expect(eventInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
    expect(resetInput).toBeInTheDocument();
    expect(countOutput).toBeInTheDocument();
});
