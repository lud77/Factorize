import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import './Toolbar.css';

const Toolbar = (props) => {
    const [ primary, setPrimary ] = React.useState<string>(props.primary);
    const [ secondary, setSecondary ] = React.useState<string | null>(null);

    const hasTertiary = secondary && props.menus[primary].submenus[secondary].submenus;

    const selectPrimaryItem = (item) => (e) => {
        setSecondary(null);
        setPrimary(item);
    };

    const selectSecondaryItem = (item) => (e) => {
        setSecondary(item);
    };

    const icon = (current) => {
        if (current?.icon) return <>{current.icon}&nbsp;&nbsp;</>;
        if (current?.chevron) return <><span className="Chevron"><FontAwesomeIcon icon={solid('angle-right')} /></span>&nbsp;&nbsp;</>;

        return '';
    };

    const primaryMenu = () => {
        return Object.keys(props.menus)
            .map((item, key) => {
                const current = props.menus[item];

                return (
                    <div
                        key={key}
                        className={`Item ${(item == primary) ? 'Selected' : ''}`}
                        onClick={(e) => {
                            selectPrimaryItem(item)(e);
                        }}
                        >
                        {icon(current)}{current.label}
                    </div>
                );
            });
    };

    const secondaryMenu = () => {
        if (props.menus[primary].component) {
            return props.menus[primary].component;
        }

        if (props.menus[primary].submenus) {
            return Object.keys(props.menus[primary].submenus)
                .map((item, key) => {
                    const current = props.menus[primary].submenus[item];

                    return (
                        <div
                            key={primary + '_' + key}
                            className={`Item ${current.submenus ? 'Submenu' : ''} ${(item == secondary) ? 'Selected' : ''} ${current.active ? 'Active' : ''}`}
                            onClick={(e) => {
                                selectSecondaryItem(item !== secondary ? item : null)(e);
                                if (current.execute) current.execute(e.target);
                            }}
                            >
                            {icon(current)}{current.label}
                        </div>
                    );
                });
        }
    };

    const tertiaryMenu = () => {
        if (!hasTertiary) return null;

        return Object.keys(props.menus[primary].submenus[secondary].submenus)
            .map((item, key) => {
                const current = props.menus[primary].submenus[secondary].submenus[item];

                return (
                    <div
                        key={primary + '_' + secondary + '_' + key}
                        className={`Item ${current?.active ? 'Active' : ''}`}
                        onClick={(e) => current.execute(e.target)}
                        >
                        {icon(current)}{current.label}
                    </div>
                );
            });
    };

    return <div className="Toolbar">
        <div className="Menu Primary">{primaryMenu()}</div>
        <div className="Menu Secondary">{secondaryMenu()}</div>
        <div className={`Menu Tertiary ${secondary ?? ''} ${hasTertiary ? '' : 'Hidden'}`}>{tertiaryMenu()}</div>
    </div>;
};

export default Toolbar;