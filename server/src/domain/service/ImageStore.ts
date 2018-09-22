import { Image } from "@src/domain/model/Image";

/**
 * Service for image processing and persistent storage
 */
export interface ImageStore {
  /**
   * Save image to permanent storage and return its details
   */
  save(stream: NodeJS.ReadableStream): Promise<Image>;

  /**
   * Remove previously saved image from permanent storage
   */
  destroy(removeKey: string): Promise<void>;
}
