import * as React from 'react';
import { createSecureContext } from 'tls';

import './Toolbar.css';

const Toolbar = (props) => {
    const [ primary, setPrimary ] = React.useState<string>(props.default);

    const selectPrimaryItem = (item) => (e) => {
        setPrimary(item);
    };

    const isSelected = (item) => item === primary;

    const icon = (current) => (
        current.icon
            ? <>
                {current.icon}&nbsp;&nbsp;
            </>
            : ''
    );

    return <div className="Toolbar">
        <div className="Menu Primary">
            {
                Object.keys(props.menus)
                    .map((item, key) => (
                        <div
                            key={key}
                            className={`Item ${isSelected(item) ? 'Selected' : ''}`}
                            onClick={selectPrimaryItem(item)}
                            >{item}</div>
                    ))
            }
        </div>
        <div className="Menu Secondary">
            {
                Object.keys(props.menus[primary])
                    .map((item, key) => {
                        const current = props.menus[primary][item];

                        return (
                            <div
                                key={primary + '_' + key}
                                className={`Item ${current.active ? 'Active' : ''}`}
                                onClick={(e) => current.execute(e.target)}
                                >
                                {icon(current)}{item}
                            </div>
                        );
                    })
            }
        </div>
    </div>;
};

export default Toolbar;