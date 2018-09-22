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
   * Upload a file as a stream
   */
  public save(stream: NodeJS.ReadableStream) {
    return new Promise<cloudinary.v2.uploader.UploadResult>(
      (resolve, reject) => {
        const destination = cloudinary.v2.uploader.upload_stream(
          this.uploadOptions,
          (err, result) => (err ? reject(err) : resolve(result))
        );

        stream.pipe(destination);
      }
    ).then(this.uploadResultMapper.transform);
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
