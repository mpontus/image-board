import { Image } from "@src/domain/model/Image";

/**
 * Service for image processing and persistent storage
 */
export abstract class ImageStore {
  /**
   * Save image to permanent storage and return its details
   */
  public abstract save(stream: NodeJS.ReadableStream): Promise<Image>;

  /**
   * Remove previously saved image from permanent storage
   */
  public abstract destroy(removeKey: string): Promise<void>;
}
