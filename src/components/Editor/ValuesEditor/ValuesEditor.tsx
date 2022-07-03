import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import './ValuesEditor.css';

const ValuesEditor = ({ panel, setPanel, setFocus }) => {
    const disabled = panel == null;
    const locked = disabled || (!disabled && panel.locked === true);

    return <>
        <div
            className={`IconItem ${disabled ? 'Disabled' : ''}`}
            onClick={disabled ? () => {} : () => { setPanel({ ...panel, locked: !panel.locked }) }}
            >
            {
                locked
                    ? <FontAwesomeIcon icon={solid('lock')} />
                    : <FontAwesomeIcon icon={solid('lock-open')} />
            }
        </div>
        <div className="TextItem">
            <input
                placeholder="Title"
                disabled={locked}
                value={disabled ? '' : panel.title}
                onChange={(e) => { setPanel({ ...panel, title: e.target.value }) }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setFocus(null);
                    }
                }}
                />
        </div>
    </>;
};

export default ValuesEditor;