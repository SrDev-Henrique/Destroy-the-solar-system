/* eslint-disable no-unused-vars */
import * as THREE from "three";
import { getFresnelMat } from "./getFresnelMat.js";
import { vertexShader } from "../shaders/planetVertex.glsl.js";
import { fragmentShader } from "../shaders/planetFragment.glsl.js";

// import { getPlanetShader } from "./getPlanetShader.js";

const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 16);

function getPlanet({
  children = [],
  distance = 0,
  img = "",
  mesh1 = "",
  mesh2 = "",
  size = 1,
  color1 = 0xffffff,
  color2 = 0x000000,
  // damageTexture = "", 
  specularMap = "",
  bumpMap = "",
  bumpScale = 0.0,
  alphaMap = "",
  shininess = 0,
}) {
  const orbitGroup = new THREE.Group();
  orbitGroup.rotation.y = (Math.PI * 1.5) * 180 / 2;

  const path = `./textures/${img}`;
  const map = texLoader.load(path);
  const planetMat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 }, // Mesmo que não seja usado agora
    },
  });

  const planet = new THREE.Mesh(geo, planetMat);
  planet.scale.setScalar(size);

  const startAngle = Math.random() * Math.PI * 2;
  planet.position.x = Math.cos(startAngle) * distance;
  planet.position.z = Math.sin(startAngle) * distance;

  if (mesh1) {
    const firstMat = new THREE.MeshBasicMaterial({
      map: texLoader.load(`./textures/mesh/${mesh1}`),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const firstMesh = new THREE.Mesh(geo, firstMat);
    firstMesh.scale.setScalar(1.001);
    firstMesh.renderOrder = 1;
    planet.add(firstMesh);
    console.log(mesh1)
  }

  if (mesh2) {
    const secondMat = new THREE.MeshStandardMaterial({
      map: texLoader.load(`./textures/mesh/${mesh2}`),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      alphaMap: alphaMap
        ? texLoader.load(`./textures/alpha-map${alphaMap}`)
        : null,
    });
    const secondMesh = new THREE.Mesh(geo, secondMat);
    secondMesh.scale.setScalar(1.003);
    secondMesh.renderOrder = 2;
    planet.add(secondMesh);
    console.log(mesh2)
  }

  const planetRimMat = getFresnelMat({
    rimHex: color1,
    facingHex: color2,
  });
  const planetRimMesh = new THREE.Mesh(geo, planetRimMat);
  planetRimMesh.scale.setScalar(1.01);
  planet.add(planetRimMesh);

  children.forEach((child) => {
    child.position.x = Math.cos(startAngle) * distance;
    child.position.z = Math.sin(startAngle) * distance;
    orbitGroup.add(child);
  });

  const rate = Math.random() * 1 - 1.0;
  orbitGroup.userData.update = (t) => {
    orbitGroup.rotation.y = t * rate;
    children.forEach((child) => {
      child.userData.update?.(t);
    });
  };

  orbitGroup.add(planet);
  return orbitGroup;
}

export default getPlanet;
