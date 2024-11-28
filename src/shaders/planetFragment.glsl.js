const fragmentShader = `
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec2 uv =  vUv;
    uv.y += uTime;

    gl_FragColor = vec4(vec3(step(0.5, mod(uv.y * 10.0, 1.))), 1.0);
}`;

export { fragmentShader };