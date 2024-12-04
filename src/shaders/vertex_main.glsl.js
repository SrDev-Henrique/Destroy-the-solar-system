const vertexMain = /* glsl */ `

vUv = uv;

vec3 coords =  normal;
coords.y += uTime;

vec3 noisePattern = vec3(noise(coords / 1.5));
float pattern = wave(noisePattern * 0.5);

vDisplacement = pattern;

float displacement = vDisplacement / 10.;
vec3 displacedPosition = position + normal * displacement;
transformed += normal * displacement;

vCloudPosition = position + normal * (displacement + uCloudOffset);

gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.);
`;

export { vertexMain };