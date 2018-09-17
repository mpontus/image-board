declare module "multer-storage-cloudinary" {
  import * as cloudinary from "cloudinary";
  import * as express from "express";
  import multer from "multer";

  const cloudinaryStorage: (
    options: cloudinaryStorage.Options
  ) => multer.StorageEngine;

  namespace cloudinaryStorage {
    type Getter<T> = (
      req: express.Request,
      file: Express.Multer.File,
      cb: (err: Error | null | undefined, result: T) => void
    ) => void;

    type Value<T> = T | Getter<T>;

    interface Options {
      cloudinary: typeof cloudinary;
      filename?: Value<string>;
      folder?: Value<string>;
      transformation?: Value<object>;
      type?: Value<string>;
      format?: Value<string>;
      params?: Value<object>;
      allowedFormats?: Value<string[]>;
    }
  }

  export = cloudinaryStorage;
}
