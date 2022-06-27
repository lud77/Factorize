const getBounds = (el: HTMLElement) => {
    const parentEl = el.offsetParent;
    const box = el.getBoundingClientRect();

    const top = box.top + window.pageYOffset + (parentEl?.scrollTop || 0);
    const right = box.right + window.pageXOffset + (parentEl?.scrollLeft || 0);
    const bottom = box.bottom + window.pageYOffset + (parentEl?.scrollTop || 0);
    const left = box.left + window.pageXOffset + (parentEl?.scrollLeft || 0);

    return {
        top,
        right,
        bottom,
        left,
        width: right - left,
        height: bottom - top
    };
};

const buildScreenSize = () => ({
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight
});

const getSelectorsFor = (workAreaOffset) => {
	const getPanelWorkAreaCoords = (panel) => {
		const left = panel.left + workAreaOffset[0];
		const top = panel.top + workAreaOffset[1];

		return {
			left,
			top,
			right: left + panel.width - 1,
			bottom: top + panel.height - 1
		};
	};

	const selectInclusive = (panels, selection) =>
		Object.values(panels)
			.map((panel) => {
				const panelCoords = getPanelWorkAreaCoords(panel);

				if (panelCoords.right < selection.left) return null;
				if (panelCoords.bottom < selection.top) return null;
				if (panelCoords.left > selection.right) return null;
				if (panelCoords.top > selection.bottom) return null;
				return panel;
			})
			.filter(Boolean);

	const selectExclusive = (panels, selection) =>
		Object.values(panels)
			.map((panel) => {
				const panelCoords = getPanelWorkAreaCoords(panel);

				if (panelCoords.left < selection.Left) return null;
				if (panelCoords.top < selection.top) return null;
				if (panelCoords.right > selection.right) return null;
				if (panelCoords.bottom > selection.bottom) return null;
				return panel;
			})
			.filter(Boolean);

    return {
        selectInclusive,
        selectExclusive
    };
};

const linear = (x) => x;
const snapping = (x) => Math.floor(x / 16) * 16;

export {
    getBounds,
    buildScreenSize,
    getSelectorsFor,
    linear,
    snapping
};