import { ClassNames } from '@emotion/react';
import * as React from 'react';

import './Toolbar.css';

const Toolbar = (props) => {
    const [ primary, setPrimary ] = React.useState<string>('File');

    const selectPrimaryItem = (item) => (e) => {
        setPrimary(item);
    };

    const isSelected = (item) => item === primary;

    return <div className="Toolbar" ref={props.toolbar}>
        <div className="Menu Primary">
            {
                Object.keys(props.menus).map((item, key) => {
                    const classes = [
                        'Item', 
                        isSelected(item) ? 'Selected' : null
                    ].filter(Boolean);

                    return <div key={key} className={ classes.join(' ') } onClick={selectPrimaryItem(item)}>{item}</div>;
                })
            }
        </div>
        <div className="Menu Secondary">
            {Object.keys(props.menus[primary]).map((item, key) => <div key={key} className="Item" onClick={props.menus[primary][item]}>{item}</div>)}
        </div>
    </div>;
};

export default Toolbar;