/* eslint-disable no-unused-vars */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import getSun from "./getSun.js";
import getNebula from "./getNebula.js";
import getStarfield from "./getStarfield.js";
import getPlanet from "./getPlanet.js";
import getAsteroidBelt from "./getAsteroidBelt.js";
import getElipticLines from "./getElipticLines.js";
import cubeTexture from "./background.js";
import AnimationController from "./animationController.js";
import "../styles/main.scss";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2.5, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
// scene.overrideMaterial = wireMat;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
const useAnimatedCamera = false;
function initScene(data) {
  const { objs } = data;
  const solarSystem = new THREE.Group();
  solarSystem.userData.update = (t) => {
    solarSystem.children.forEach((child) => {
      child.userData.update?.(t);
    });
  };
  scene.add(solarSystem);
  scene.background = cubeTexture;

  // const sun = getSun();
  // solarSystem.add(sun);

  // const mercury = getPlanet({ size: 0.1, distance: 100.25, img: "mercury.png" });
  // solarSystem.add(mercury);

  // const venus = getPlanet({ size: 0.2, distance: 100.65, img: "venus.png" });
  // solarSystem.add(venus);

  const moon = getPlanet({ size: 0.075, distance: 4, img: "moon.png" });
  const earth = getPlanet({
    children: [moon],
    distance: 0,
    img: "earth.jpg",
    mesh1: "03_earthlights1k.jpg",
    mesh2: "04_earthcloudmap.jpg",
    size: 1.25,
    color1: 0x0088ff,
    color2: 0x000000,
    specularMap: "02_earthspec1k.jpg",
    bumpMap: "01_earthbump1k.jpg",
    bumpScale: 0.5,
    alphaMap: "05_earthcloudmaptrans.jpg",
    shininess: 10,
    // damageTexture: "earth_damaged.jpg",
  });
  solarSystem.add(earth);

  let planetShader;

  const planetMat = earth.children.find(
    (child) => child instanceof THREE.Mesh
  ).material;

  let planet = earth.children.find((child) => child instanceof THREE.Mesh);

  // function triggerImpact(planet, position, duration = 3.0) {
  //   const shaderMaterial = planet.material;
  //   if (!(shaderMaterial instanceof THREE.ShaderMaterial)) {
  //     return;
  //   }

  //   const planetRadius = planet.scale.x;
  //   shaderMaterial.uniforms.impactPosition.value.copy(position);
  //   shaderMaterial.uniforms.impactRadius.value = 0.0;

  //   const start = Date.now();
  //   const interval = setInterval(() => {
  //     const elapsed = (Date.now() - start) / 1000; // Tempo decorrido em segundos
  //     const t = Math.min(elapsed / duration, 1.0); // Progresso da animação (0 a 1)

  //     shaderMaterial.uniforms.impactRadius.value = (t * planetRadius) * 1.3;

  //     if (t >= 1.0) {
  //       clearInterval(interval);
  //     }
  //   }, 16); // Atualiza ~60fps
  // }
  // console.log("Tipo de material:", planet.material.constructor.name);

  // function toLocalSpace(object, position) {
  //   const localPosition = position.clone();
  //   object.worldToLocal(localPosition);
  //   return localPosition;
  // }

  // // Exemplo de uso
  // const globalImpactPosition = new THREE.Vector3(0.5, 0.5, 0.0); // Global
  // const localImpactPosition = toLocalSpace(planet, globalImpactPosition);
  // console.log("Global impact position:", globalImpactPosition);
  // console.log("Local impact position:", localImpactPosition);

  // setTimeout(() => {
  //   triggerImpact(planet, localImpactPosition, 1.0, 3.0);
  // }, 2000);

  // const mars = getPlanet({ size: 0.15, distance: 2.25, img: "mars.png" });
  // solarSystem.add(mars);

  // const asteroidBelt = getAsteroidBelt(objs);
  // solarSystem.add(asteroidBelt);

  // const jupiter = getPlanet({ size: 0.4, distance: 2.75, img: "jupiter.png" });
  // solarSystem.add(jupiter);

  // const sRingGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 64);
  // const sRingMat = new THREE.MeshStandardMaterial();
  // const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
  // saturnRing.scale.z = 0.1;
  // saturnRing.rotation.x = Math.PI * 0.5;
  // const saturn = getPlanet({
  //   children: [saturnRing],
  //   size: 0.35,
  //   distance: 3.25,
  //   img: "saturn.png",
  // });
  // solarSystem.add(saturn);

  // const uRingGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 64);
  // const uRingMat = new THREE.MeshStandardMaterial();
  // const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
  // uranusRing.scale.z = 0.1;
  // const uranus = getPlanet({
  //   children: [uranusRing],
  //   size: 0.3,
  //   distance: 3.75,
  //   img: "uranus.png",
  // });
  // solarSystem.add(uranus);

  // const neptune = getPlanet({ size: 0.3, distance: 4.25, img: "neptune.png" });
  // solarSystem.add(neptune);

  // const elipticLines = getElipticLines();
  // solarSystem.add(elipticLines);

  const starfield = getStarfield({ numStars: 2000, size: 0.35 });
  scene.add(starfield);

  // const dirLight = new THREE.PointLight(0xffffff, 2.0);
  // dirLight.position.set(-3, 0.5, 1.5);
  // scene.add(dirLight);

  // const light = new THREE.AmbientLight(0xffffff, 0.005);
  // scene.add(light);

  const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
  sunLight.position.set(-2, 0.5, 1.5);
  scene.add(sunLight);

  // const nebula = getNebula({
  //   hue: 0.6,
  //   numSprites: 10,
  //   opacity: 0.2,
  //   radius: 40,
  //   size: 80,
  //   z: -300.5,
  // });
  // scene.add(nebula);

  // const anotherNebula = getNebula({
  //   hue: 0.0,
  //   numSprites: 10,
  //   opacity: 0.2,
  //   radius: 40,
  //   size: 80,
  //   z: 300.5,
  // });
  // scene.add(anotherNebula);

  const cameraDistance = 5;
  function animate(t = 0) {
    requestAnimationFrame(animate);

    const time = t * 0.0002;

    solarSystem.userData.update(time);
    AnimationController.update(t);

    renderer.render(scene, camera);

    if (useAnimatedCamera) {
      camera.position.x = Math.cos(time * 0.75) * cameraDistance;
      camera.position.y = Math.cos(time * 0.75);
      camera.position.z = Math.sin(time * 0.75) * cameraDistance;
      camera.lookAt(0, 0, 0);
    } else {
      controls.update();
    }

    // if (planetMat && planetMat.uniforms) {
    //   planetMat.userdata.shader.uniforms.uTime.value = time * 0.4;
    // }
  }

  animate();
};

const sceneData = {
  objs: [],
};
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const loader = new OBJLoader(manager);
const objs = ["Rock1", "Rock2", "Rock3"];
objs.forEach((name) => {
  let path = `./rocks/${name}.obj`;
  loader.load(path, (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        sceneData.objs.push(child);
      }
    });
  });
});

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
