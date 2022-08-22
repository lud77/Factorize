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

const overlapsArea = (areaCoords) => (testCoords) => {
	if (testCoords.right < areaCoords.left) return false;
	if (testCoords.bottom < areaCoords.top) return false;
	if (testCoords.left > areaCoords.right) return false;
	if (testCoords.top > areaCoords.bottom) return false;
	return true;
};

const isIncludedInArea = (areaCoords) => (testCoords) => {
	if (testCoords.left < areaCoords.Left) return false;
	if (testCoords.top < areaCoords.top) return false;
	if (testCoords.right > areaCoords.right) return false;
	if (testCoords.bottom > areaCoords.bottom) return false;
	return true;
};

const getSelectorsFor = (workAreaOffset) => {
	const getPanelWorkAreaCoords = (panel, panelCoords) => {
		const left = panelCoords.left + workAreaOffset[0];
		const top = panelCoords.top + workAreaOffset[1];

		return {
			left,
			top,
			right: left + panel.width - 1,
			bottom: top + panel.height - 1
		};
	};

	const selectInclusive = (panels, panelCoords, selection) =>
		Object.values(panels)
			.map((panel) => {
				const coords = getPanelWorkAreaCoords(panel, panelCoords[panel.panelId]);

				const isOverlapping = overlapsArea(selection)(coords);
				return isOverlapping ? panel : null;
			})
			.filter(Boolean);

	const selectExclusive = (panels, panelCoords, selection) =>
		Object.values(panels)
			.map((panel) => {
				const coords = getPanelWorkAreaCoords(panel, panelCoords[panel.panelId]);

				const isOverlapping = isIncludedInArea(selection)(coords);
				return isOverlapping ? panel : null;
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
    snapping,
	overlapsArea,
	isIncludedInArea
};