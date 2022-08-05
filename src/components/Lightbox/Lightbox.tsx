import * as React from 'react';

import './Lightbox.css';

const Lightbox = (props) => {
    return (
        <div className="Lightbox Backdrop" onClick={props.close}>
            <div className="Content" onClick={props.close}>
                <div className="Lightbox Image">
                    <img src={props.url} />
                </div>
                <div className="Lightbox Caption">
                    <span>{props.caption || null}</span>
                </div>
            </div>
        </div>
    );
};

export default Lightbox;