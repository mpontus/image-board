/**
 * Convert Blob or File to data url containing Base64 string.
 *
 * @param file File | Blob Blob or file
 * @return Promise<string> Data URL
 */
const fileToDataUrl = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default fileToDataUrl;
