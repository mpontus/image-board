import * as cloudinary from "cloudinary";
import { injectable } from "inversify";
import { Image } from "../../domain/model/Image";
import { ImageStore } from "../../domain/service/ImageStore";
import { DataMapper } from "../DataMapper";
import { CloudinaryUploadResultMapper } from "./CloudinaryUploadResultMapper";

/**
 * File storage which stores images using Cloudinary service
 */
@injectable()
export class CloudinaryImageStore extends ImageStore {
  private readonly uploadResultMapper: DataMapper<
    cloudinary.v2.uploader.UploadResult,
    Image
  > = new CloudinaryUploadResultMapper();

  /**
   * Create new CloudinaryFileStorage instance
   */
  constructor(
    private readonly uploadOptions: cloudinary.v2.uploader.UploadOptions
  ) {
    super();
  }

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
        stream.resume();
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
