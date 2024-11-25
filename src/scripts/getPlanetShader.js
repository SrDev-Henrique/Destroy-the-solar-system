import * as THREE from "three";

function getPlanetShader({ baseTexture, damageTexture }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      baseMap: { value: baseTexture },
      damageMap: { value: damageTexture || baseTexture },
      impactPosition: { value: new THREE.Vector3(0, 0, 0) },
      impactRadius: { value: 0.0 },
      ...THREE.UniformsLib['lights'], // Include lighting uniforms
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

      ${THREE.ShaderChunk['common']}
      ${THREE.ShaderChunk['lights_pars_begin']} // Inclui funções de iluminação

      void main() {
          // Distância para o impacto (efeito de dano)
          float dist = distance(vPosition, impactPosition);
          float mask = dist < impactRadius ? 1.0 : 0.0;

          // Obtendo as cores base e de dano
          vec4 baseColor = texture2D(baseMap, vUv);
          vec4 damageColor = texture2D(damageMap, vUv);

          // Misturando as cores
          vec4 finalColor = mix(baseColor, damageColor, mask);

          // Adicionando iluminação (Phong Shading)
          vec3 normal = normalize(vNormal); // Normal da superfície
          vec3 light = vec3(0.0);

          // Calculate directional lighting
          #if NUM_DIR_LIGHTS > 0
          for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
              vec3 lightDir = normalize(directionalLights[i].direction);
              float diff = max(dot(normal, lightDir), 0.0);
              light += diff * directionalLights[i].color;
          }
          #endif

          // Calculate point lighting
          #if NUM_POINT_LIGHTS > 0
          for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
              vec3 lightDir = normalize((viewMatrix * vec4(pointLights[i].position, 1.0)).xyz - vPosition);
              float diff = max(dot(normal, lightDir), 0.0);
              light += diff * pointLights[i].color;
          }
          #endif

          // Calculate ambient lighting
          light += ambientLightColor;

          vec3 diffuse = light * finalColor.rgb; // Cor modulada pela difusão
          gl_FragColor = vec4(diffuse, finalColor.a);
      }
    `,
    lights: true,
    transparent: true,
  });
}

export { getPlanetShader };
