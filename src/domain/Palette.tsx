const Palette = (addPanel) => {
    const panelPalette = (paletteName, palette) => {
        return Object.keys(palette)
            .map((panelType) => ({
                name: panelType,
                label: panelType,
                execute: () => addPanel(panelType)
            }))
            .reduce((a, v) => ({
                ...a,
                [v.name]: v
            }), {});
    };

    const panelGroupPalette = (palettes) => {
        return Object.keys(palettes)
            .map((paletteName) => ({
                name: paletteName,
                label: paletteName,
                submenus: panelPalette(paletteName, palettes[paletteName]),
                chevron: true
            }))
            .reduce((a, v) => ({
                ...a,
                [v.name]: v
            }), {});
    };

    const flagPalette = (flags) => {
        return Object.keys(flags)
            .map((flagName) => {
                const [ flag, setFlag ] = flags[flagName];

                return {
                    name: flagName,
                    label: flagName,
                    execute: () => { setFlag(!flag); },
                    active: flag
                };
            })
            .reduce((a, v) => ({
                ...a,
                [v.name]: v
            }), {});
    };

    return {
        panelGroupPalette,
        flagPalette
    };
};

export default Palette;