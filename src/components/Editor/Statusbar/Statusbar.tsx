import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import './Statusbar.css';

const Statusbar = (props) => {
    return <div className="Statusbar">
        <div className="Element">
            <FontAwesomeIcon icon={solid('bell')} />
        </div>
        <div className="Element">
            {props.status}
        </div>
    </div>;
};

export default Statusbar;