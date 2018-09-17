import * as multer from "multer";

/**
 * Multer-compatible storage interface
 *
 * Abstract storage enables image upload and deletion in produciton
 * (cloudinary) and for integraiton testing (TestStorage).
 */
interface Storage extends multer.StorageEngine {
  delete(id: string): Promise<void>;
}

export default Storage;
