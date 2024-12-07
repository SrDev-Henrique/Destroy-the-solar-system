const fragmentMain = /* glsl */ `
// normal = perturbNormalArb( - vViewPosition, normal, vec2(dFdx(vDisplacement), dFdy(vDisplacement)), faceDirection);

// float cloudNoise = noise(normal * 5.0 + uTime * 0.1);
// vec3 cloudColor = vec3(0.0);
// float cloudOpacity = smoothstep(0.4, 0.7, cloudNoise);

// vec3 finalColor = mix(planetColor, cloudColor, cloudOpacity * 0.5);

// gl_FragColor = vec4(1.0, 0.3, 0.5, 1.0);

vec4 sampledTexture = texture(uTexture, vUv); // 'vUv' precisa ser passado do vertex shader
vec3 planetColor = getPlanetColor(vDisplacement);
vec3 finalColor = mix(planetColor, sampledTexture.rgb, 0.5); // Mistura com a cor do planeta
gl_FragColor = vec4(finalColor, 1.0);

#include <normal_fragment_maps>
`;

export { fragmentMain };