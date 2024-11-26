import * as THREE from "three";

const loader = new THREE.TextureLoader();

function resizeImageToSquare(image, size = 1024) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(image, 0, 0, size, size);
  return canvas;
}

const cubeTexture = new THREE.CubeTexture();

const paths = [
  "../Skybox/Right.png", // positivo X
  "../Skybox/Left.png", // negativo X
  "../Skybox/Up.png", // positivo Y
  "../Skybox/Down.png", // negativo Y
  "../Skybox/Front.png", // positivo Z
  "../Skybox/Back.png", // negativo Z
];

let loadedImages = 0;

paths.forEach((path, index) => {
  loader.load(
    path,
    (texture) => {
      const resizedImage = resizeImageToSquare(texture.image, 1024);
      const resizedTexture = new THREE.CanvasTexture(resizedImage);
      cubeTexture.images[index] = resizedTexture.image;

      loadedImages++;
      if (loadedImages === paths.length) {
        cubeTexture.needsUpdate = true;
      }
    },
    undefined,
    (error) => {
      console.error(`Erro ao carregar a imagem ${path}:`, error);
    }
  );
});

export default cubeTexture;
