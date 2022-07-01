const Palette = (makePanel) => {
    const panelMenu = (paletteName, palette) => {
        return Object.keys(palette)
            .map((panel) => ({
                name: panel,
                execute: () => makePanel(paletteName, panel)
            }))
            .reduce((a, v) => ({
                ...a,
                [v.name]: v
            }), {});
    };

    const paletteMenu = (palettes) => {
        return Object.keys(palettes)
            .map((paletteName) => ({
                name: paletteName,
                submenus: panelMenu(paletteName, palettes[paletteName]),
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
        paletteMenu,
        flagPalette
    };
};

export default Palette;