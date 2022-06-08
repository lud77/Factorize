import { ClassNames } from '@emotion/react';
import * as React from 'react';

import './Toolbar.css';

const Toolbar = (props) => {
    const [ primary, setPrimary ] = React.useState<string>('File');

    const selectPrimaryItem = (item) => (e) => {
        setPrimary(item);
    };

    const selectSecondaryItem = (item) => (e) => {
        console.log(item);
    };

    const isSelected = (item) => item === primary;

    return <div className="Toolbar" ref={props.ref}>
        <div className="Menu Primary">
            {
                Object.keys(props.menus).map((item) => {
                    const classes = [
                        'Item', 
                        isSelected(item) ? 'Selected' : null
                    ].filter(Boolean);
                    
                    return <div className={ classes.join(' ') } onClick={selectPrimaryItem(item)}>{item}</div>;
                })
            }
        </div>
        <div className="Menu Secondary">
            {props.menus[primary].map((item) => <div className="Item" onClick={selectSecondaryItem(item)}>{item}</div>)}
        </div>
    </div>;
};

export default Toolbar;