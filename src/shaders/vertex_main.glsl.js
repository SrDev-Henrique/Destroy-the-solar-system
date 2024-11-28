const vertexMain = /* glsl */ `
vec3 coords =  normal;
coords.y += uTime;
vec3 noisePattern = vec3(noise(coords / 1.5));
float pattern = wave(noisePattern * 0.5);

vDisplacement = pattern;

float displacement = vDisplacement / 10.;
transformed += normal * displacement;
`;

export { vertexMain };