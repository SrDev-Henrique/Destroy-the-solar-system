import * as THREE from "three";

// Configurações iniciais do WebGL e renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cena e câmera principais
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

// Configurações do render target para textura principal
const renderTarget = new THREE.WebGLRenderTarget(1024, 1024, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
});

// Shader para textura principal
const planetShaderMaterial = new THREE.ShaderMaterial({
  fragmentShader: `
// Seu fragment shader para a textura principal
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float e, k;
    vec3 materialColor = samplePlanet(vec3(uv, 0.0), e, k); // Função customizada
    fragColor = vec4(materialColor, 1.0);
}`,
  uniforms: {
    iResolution: { value: new THREE.Vector2(1024, 1024) },
    iTime: { value: 0 },
    // Adicione outros uniforms necessários
  },
});

// Cena para renderizar o shader principal
const shaderScene = new THREE.Scene();
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  planetShaderMaterial
);
shaderScene.add(plane);
const shaderCamera = new THREE.Camera();

// Renderiza o shader principal para o render target
renderer.setRenderTarget(renderTarget);
renderer.render(shaderScene, shaderCamera);
renderer.setRenderTarget(null);

// Configurações do render target para emissiveMap
const emissiveTarget = new THREE.WebGLRenderTarget(1024, 1024, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
});

// Shader para emissiveMap
const emissiveShaderMaterial = new THREE.ShaderMaterial({
  fragmentShader: `
// Seu fragment shader para o emissiveMap
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float e, k;
    vec3 materialColor = samplePlanet(vec3(uv, 0.0), e, k); // Reaproveita lógica do shader principal
    float emissiveStrength = smoothstep(0.8, 1.0, e); // Define brilho baseado na altura
    vec3 emissiveColor = emissiveStrength * vec3(1.0, 0.5, 0.0); // Lava brilhante
    fragColor = vec4(emissiveColor, 1.0); // Somente emissividade
}`,
  uniforms: {
    iResolution: { value: new THREE.Vector2(1024, 1024) },
    iTime: { value: 0 },
    // Outros uniforms necessários
  },
});

// Cena para renderizar o emissiveMap
const emissiveScene = new THREE.Scene();
const emissivePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  emissiveShaderMaterial
);
emissiveScene.add(emissivePlane);

// Renderiza o emissiveMap para o render target
renderer.setRenderTarget(emissiveTarget);
renderer.render(emissiveScene, shaderCamera);
renderer.setRenderTarget(null);

// Configurações do material do planeta
const planetMaterial = new THREE.MeshPhongMaterial({
  map: renderTarget.texture, // Textura principal gerada pelo shader
  emissive: new THREE.Color(0xffffff), // Base emissiva
  emissiveMap: emissiveTarget.texture, // Mapa de emissividade gerado pelo shader
  emissiveIntensity: 1.5, // Intensidade do brilho
  roughness: 1,
  metalness: 0,
});

// Geometria e malha do planeta
const planetGeometry = new THREE.SphereGeometry(5, 64, 64);
const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planetMesh);

// Adiciona iluminação à cena
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Render loop
function animate(time) {
  requestAnimationFrame(animate);

  // Atualiza os uniforms do tempo para animação nos shaders
  planetShaderMaterial.uniforms.iTime.value = time * 0.001;
  emissiveShaderMaterial.uniforms.iTime.value = time * 0.001;

  renderer.setRenderTarget(renderTarget);
  renderer.render(shaderScene, shaderCamera);

  renderer.setRenderTarget(emissiveTarget);
  renderer.render(emissiveScene, shaderCamera);

  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
}

animate();
