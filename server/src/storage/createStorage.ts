import * as cloudinaryStorage from "multer-storage-cloudinary";
import CloudinaryStorage from "./CloudinaryStorage";
import Storage from "./Storage";
import TestStorage from "./TestStorage";

/**
 * Storage options
 */
interface Options {
  /**
   * Storage type
   */
  storageType: string;

  /**
   * Cloudinary credentials speicifed as a url
   */
  cloudinaryUrl?: string;

  /**
   * Storage params for cloudinary storage
   */
  storageParams?: Partial<cloudinaryStorage.Options>;
}

/**
 * Create a storage
 */
const createStorage = (options: Options): Storage => {
  switch (options.storageType) {
    case "test":
      return new TestStorage();

    case "cloudinary":
      if (!options.cloudinaryUrl) {
        throw new Error("CloudinaryUrl must be speicifed");
      }

      return new CloudinaryStorage(
        options.cloudinaryUrl,
        options.storageParams
      );

    default:
      throw new Error(`Invalid storage type: ${options.storageType}`);
  }
};

export default createStorage;
