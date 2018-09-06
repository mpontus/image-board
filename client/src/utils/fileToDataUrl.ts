/**
 * Convert File to data url
 *
 * @param file File | Blob Blob or file
 * @return Promise<string> Data URL
 */
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result == null) {
        reject(new Error("Reader result is null"));
      } else if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result.toString());
      } else {
        resolve(reader.result);
      }
    };
    reader.onerror = reject;
  });

export default fileToDataUrl;
