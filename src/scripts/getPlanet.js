/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as THREE from "three";
import { getFresnelMat } from "./getFresnelMat.js";
import { vertexShader } from "../shaders/planetVertex.glsl.js";
import { fragmentShader } from "../shaders/planetFragment.glsl.js";
import { vertexPars } from "../shaders/vertex_pars.glsl.js";
import { vertexMain } from "../shaders/vertex_main.glsl.js";
import { fragmentMain } from "../shaders/fragment_main.glsl.js";
import { fragmentPars } from "../shaders/fragment_pars.glsl.js";

// import { getPlanetShader } from "./getPlanetShader.js";

const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 200);

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
  orbitGroup.rotation.y = (Math.PI * 1.5 * 180) / 2;

  const planetTexture = texLoader.load("./textures/ShaderTest/teste1.jpg");

  const path = `./textures/${img}`;
  const map = texLoader.load(path);
  const planetMat = new THREE.MeshStandardMaterial({});

  const onBeforeCompile = function (shader) {
    shader.uniforms.iTime = { value: 0.0 };

    shader.vertexShader = shader.vertexShader.replace(
      `#include <uv_pars_vertex>`,
      `#include <uv_pars_vertex>
     varying vec2 vUv;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      `#include <uv_vertex>`,
      `#include <uv_vertex>
     vUv = uv;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <common>`,
      `#include <common>
    
    uniform float iTime;
    varying vec2 vUv;

    // Matriz de rotação
    mat2 rot(float a) {
      return mat2(cos(a), sin(a), -sin(a), cos(a));
    }

    // Função de hash
    float hash21(vec2 n) {
      return fract(cos(dot(n, vec2(5.9898, 4.1414))) * 65899.89956);
    }

    // Função de ruído
    float noise(vec2 n) {   
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n);
      vec2 f = smoothstep(vec2(0.), vec2(1), fract(n));
      return mix(mix(hash21(b), hash21(b + d.yx), f.x), 
                 mix(hash21(b + d.xy), hash21(b + d.yy), f.x), f.y);
    }

    // Mistura de ruído
    vec2 mixNoise(vec2 p) {
      float epsilon = .968785675;
      float noiseX = noise(vec2(p.x + epsilon, p.y)) - noise(vec2(p.x - epsilon, p.y));
      float noiseY = noise(vec2(p.x, p.y + epsilon)) - noise(vec2(p.x, p.y - epsilon));
      return vec2(noiseX, noiseY);
    }

    // FBM (Fractal Brownian Motion)
    float fbm(vec2 p) {
      float amplitude = 3.0;
      float total = 0.0;
      vec2 pom = p;
      for (float i = 1.3232; i < 7.45; i++) {
        p += iTime * 0.05;
        pom += iTime * 0.09;
        vec2 n = mixNoise(i * p * 0.3244243 + iTime * 0.131321);
        n *= rot(iTime * 0.5 - (0.03456 * p.x + 0.0342322 * p.y) * 50.0);
        p += n * 0.5;
        total += (sin(noise(p) * 8.5) * 0.55 + 0.4566) / amplitude;

        p = mix(pom, p, 0.5);
        amplitude *= 1.3;
        p *= 2.007556;
        pom *= 1.6895367;
      }
      return total;
    }
    `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `#include <dithering_fragment>
    
    vec2 uv = vUv;
    uv.x *= 2.2; // Ajuste de zoom
    float fbmValue = fbm(uv);
    vec3 col = vec3(0.212, 0.08, 0.03) / max(fbmValue, 0.0001);
    col = pow(col, vec3(1.5));
    gl_FragColor = vec4(col, 1.0);
    `
    );

    planetShader = shader;
  };

  planetMat.onBeforeCompile = onBeforeCompile;

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
