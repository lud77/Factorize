const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));

export default clamp;