const fragmentMain = /* glsl */`
normal = perturbNormalArb( - vViewPosition, normal, vec2(dFdx(vDisplacement), dFdy(vDisplacement)), faceDirection);
vec3 planetColor = getPlanetColor(vDisplacement);

float cloudNoise = noise(normal * 5.0 + uTime * 0.1);
vec3 cloudColor = vec3(0.0);
float cloudOpacity = smoothstep(0.4, 0.7, cloudNoise);

vec3 finalColor = mix(planetColor, cloudColor, cloudOpacity * 0.5);

gl_FragColor = vec4(1.0, 0.3, 0.5, 1.0);
`

export { fragmentMain };