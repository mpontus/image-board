declare module "multer-storage-cloudinary" {
  import * as cloudinary from "cloudinary";
  import { StorageEngine } from "multer";

  interface Options {
    cloudinary: typeof cloudinary;
    folder: string;
    allowedFormats: string[];
    filename(
      req: Request,
      file: File,
      cb: (err: Error | null | undefined, filename: string) => void
    ): void;
  }

  interface CloudinaryStorageFactory {
    (options: Options): StorageEngine;
  }

  const createStorage: CloudinaryStorageFactory;

  export = createStorage;
}
