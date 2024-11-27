import * as THREE from "three";

const loader = new THREE.CubeTextureLoader();
const cubeTexture = loader.load([
  "../Skybox/posX.png", // positivo X
  "../Skybox/negX.png", // negativo X
  "../Skybox/posY.png", // positivo Y
  "../Skybox/negY.png", // negativo Y
  "../Skybox/posZ.png", // positivo Z
  "../Skybox/negZ.png", // negativo Z
]);

export default cubeTexture;
