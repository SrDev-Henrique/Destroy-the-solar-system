import * as THREE from "three";

const loader = new THREE.CubeTextureLoader();
const cubeTexture = loader.load([
  "../Skybox/posX.jpg", // positivo X
  "../Skybox/negX.jpg", // negativo X
  "../Skybox/posY.jpg", // positivo Y
  "../Skybox/negY.jpg", // negativo Y
  "../Skybox/posZ.jpg", // positivo Z
  "../Skybox/negZ.jpg", // negativo Z
]);

export default cubeTexture;
