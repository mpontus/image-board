import * as cloudinary from "cloudinary";
import * as express from "express";
import * as multer from "multer";
import * as cloudinaryStorage from "multer-storage-cloudinary";
import * as url from "url";
import Storage from "./Storage";

class CloudinaryStorage implements Storage {
  private readonly cloudinary: cloudinary.Cloudinary;
  private readonly storage: multer.StorageEngine;

  constructor(
    cloudinaryUrl: string,
    options?: Partial<cloudinaryStorage.Options>
  ) {
    const uri = url.parse(cloudinaryUrl);

    cloudinary.config({
      cloud_name: uri.host,
      api_key: uri.auth && uri.auth.split(":")[0],
      api_secret: uri.auth && uri.auth.split(":")[1],
      private_cdn: uri.pathname,
      secure_distribution: uri.pathname && uri.pathname.substring(1)
    });

    this.cloudinary = cloudinary;

    this.storage = cloudinaryStorage({
      cloudinary,
      ...options
    });
  }

  public _handleFile(
    req: express.Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ) {
    return this.storage._handleFile(req, file, callback);
  }

  public _removeFile(
    req: express.Request,
    file: Express.Multer.File,
    callback: (error: Error) => void
  ) {
    return this.storage._removeFile(req, file, callback);
  }

  public delete(id: string) {
    return this.cloudinary.uploader.destroy(id);
  }
}

export default CloudinaryStorage;
