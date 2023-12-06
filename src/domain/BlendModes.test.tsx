import BlendModes from './BlendModes'; // Import your component

test('Superimpose', () => {
    expect(BlendModes['Superimpose'](1, 0)).toBe(1);
});

test('Darken', () => {
    expect(BlendModes['Darken'](1, 0)).toBe(0);
    expect(BlendModes['Darken'](0, 1)).toBe(0);
});

test('Multiply', () => {
    expect(BlendModes['Multiply'](1, 0)).toBe(0);
    expect(BlendModes['Multiply'](1, 2)).toBe(2);
});

test('Color Burn', () => {
    expect(BlendModes['Color Burn'](1, 0)).toBe(0);
    expect(BlendModes['Color Burn'](.5, .2)).toBe(-1.5);
});

test('Linear Burn', () => {
    expect(BlendModes['Linear Burn'](1, 0)).toBe(0);
    expect(BlendModes['Linear Burn'](1, 2)).toBe(2);
});

test('Lighten', () => {
    expect(BlendModes['Lighten'](1, 0)).toBe(1);
    expect(BlendModes['Lighten'](0, 1)).toBe(1);
});

test('Screen', () => {
    expect(BlendModes['Screen'](.5, .2)).toBe(.6);
});

test('Color Dodge', () => {
    expect(BlendModes['Color Dodge'](3, 1)).toBe(255);
    expect(BlendModes['Color Dodge'](10, 5)).toBe(-2.5);
});

test('Linear Dodge', () => {
    expect(BlendModes['Linear Dodge'](1, 0)).toBe(1);
    expect(BlendModes['Linear Dodge'](1, 2)).toBe(3);
});

test('Overlay', () => {
    expect(BlendModes['Overlay'](.1, 0)).toBe(0);
    expect(BlendModes['Overlay'](.1, 2)).toBe(.4);
    expect(BlendModes['Overlay'](1, 2)).toBe(1);
});

test('Soft Light', () => {
    expect(BlendModes['Soft Light'](.1, .5)).toBe(.1);
    expect(BlendModes['Soft Light'](.1, 2)).toBe(.7486832980505138);
    expect(BlendModes['Soft Light'](.8, 2)).toBe(1.0832815729997476);
});

test('Vivid Light', () => {
    expect(BlendModes['Vivid Light'](1, 0)).toBe(1);
});

test('Hard Light', () => {
    expect(BlendModes['Hard Light'](1, 0)).toBe(1);
});

test('Linear Light', () => {
    expect(BlendModes['Linear Light'](.8, .3)).toBe(0.3999999999999999);
    expect(BlendModes['Linear Light'](.3, .8)).toBe(0.9000000000000001);
});

test('Pin Light', () => {
    expect(BlendModes['Pin Light'](.8, .3)).toBe(.6);
    expect(BlendModes['Pin Light'](.3, .8)).toBe(1.6);
});

test('Difference', () => {
    expect(BlendModes['Difference'](1, 0)).toBe(1);
    expect(BlendModes['Difference'](4, 2)).toBe(2);
    expect(BlendModes['Difference'](2, 4)).toBe(2);
});

test('Exclusion', () => {
    expect(BlendModes['Exclusion'](1, 0)).toBe(1);
    expect(BlendModes['Exclusion'](1, 3)).toBe(-2);
});

test('Subtract', () => {
    expect(BlendModes['Subtract'](1, 0)).toBe(1);
    expect(BlendModes['Subtract'](4, 2)).toBe(2);
    expect(BlendModes['Subtract'](2, 4)).toBe(-2);
});

test('Divide', () => {
    expect(BlendModes['Divide'](1, 0)).toBe(255);
    expect(BlendModes['Divide'](0, 1)).toBe(0);
    expect(BlendModes['Divide'](10, 2)).toBe(5);
});


