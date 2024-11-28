import * as THREE from "three";

function getPlanetShader({ baseTexture, damageTexture }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      baseMap: { value: baseTexture },
      damageMap: { value: damageTexture || baseTexture },
      impactPosition: { value: new THREE.Vector3(0, 0, 0) },
      impactRadius: { value: 0.0 },
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv; // Passa as UVs
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz; // Transform position to view space
        vNormal = normalize(normalMatrix * normal); // Transform normal to view space

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D baseMap;
      uniform sampler2D damageMap;
      uniform vec3 impactPosition;
      uniform float impactRadius;

      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
          // Distância para o impacto (efeito de dano)
          float dist = distance(vPosition, impactPosition);
          float mask = dist < impactRadius ? 1.0 : 0.0;

          // Obtendo as cores base e de dano
          vec4 baseColor = texture2D(baseMap, vUv);
          vec4 damageColor = texture2D(damageMap, vUv);

          // Misturando as cores
          vec4 finalColor = mix(baseColor, damageColor, mask);

          gl_FragColor = vec4(finalColor.rgb, 1.0);
      }
    `,
    transparent: true,
  });
}

export { getPlanetShader };
