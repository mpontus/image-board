/**
 * Describes stored image
 */
export interface Image {
  /**
   * Public url of the image
   */
  url: string;

  /**
   * Image width in pixels
   */
  width: number;

  /**
   * Image height in pixels
   */
  height: number;

  /**
   * Unique string identifying the image in the stroage
   */
  storageId: string;
}
