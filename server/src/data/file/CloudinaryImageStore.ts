import * as cloudinary from "cloudinary";
import { Image } from "../../domain/model/Image";
import { ImageStore } from "../../domain/service/ImageStore";
import { DataMapper } from "../DataMapper";
import { CloudinaryUploadResultMapper } from "./CloudinaryUploadResultMapper";

/**
 * File storage which stores images using Cloudinary service
 */
export class CloudinaryImageStore implements ImageStore {
  private readonly uploadResultMapper: DataMapper<
    cloudinary.v2.uploader.UploadResult,
    Image
  > = new CloudinaryUploadResultMapper();

  /**
   * Create new CloudinaryFileStorage instance
   */
  constructor(
    private readonly uploadOptions: cloudinary.v2.uploader.UploadOptions
  ) {}

  /**
   * Upload a file
   */
  public save(buffer: Buffer) {
    return cloudinary.v2.uploader
      .upload(buffer, undefined, this.uploadOptions)
      .then(this.uploadResultMapper.transform);
  }

  /**
   * Remove uploaded file
   */
  public destroy(id: string) {
    return cloudinary.v2.uploader
      .destroy(id, { invalidate: true })
      .then(() => undefined);
  }
}
