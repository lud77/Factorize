import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import './ValuesEditor.css';

const ValuesEditor = ({ panel, setPanels }) => {
    const disabled = panel == null;
    const locked = disabled || (!disabled && panel.locked === true);

    const setLock = (locked) => setPanels((panels) => {
        return {
            ...panels,
            [panel.panelId]: {
                ...panels[panel.panelId],
                locked
            }
        };
    });

    const toggleLock = () => setLock(!panel.locked);

    return <>
        <div
            className={`IconItem ${disabled ? 'Disabled' : ''}`}
            onClick={disabled ? () => {} : () => { toggleLock(); }}
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
                onChange={(e) => {
                    setPanels((panels) => {
                        return {
                            ...panels,
                            [panel.panelId]: {
                                ...panels[panel.panelId],
                                title: e.target.value
                            }
                        };
                    });
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setLock(true);
                    }
                }}
                />
        </div>
    </>;
};

export default ValuesEditor;