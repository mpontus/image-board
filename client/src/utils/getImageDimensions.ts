interface Dimensions {
  width: number;
  height: number;
}

/**
 * Return dimensions of an image specified as a File
 *
 * @param file File Image file
 * @return Dimensions Object containing width and height
 */
const getImageDimensions = (file: File): Promise<Dimensions> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () =>
      resolve({
        width: image.width,
        height: image.height,
      });
  });

export default getImageDimensions;
