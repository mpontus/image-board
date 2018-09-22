import * as cloudinary from "cloudinary";
import { Image } from "../../domain/model/Image";
import { DataMapper } from "../DataMapper";

/**
 * Map cloudinary upload result to UploadResult
 */
export class CloudinaryUploadResultMapper
  implements DataMapper<cloudinary.v2.uploader.UploadResult, Image> {
  /**
   * Transform cloudinary upload response to Image domain model
   */
  public transform(file: cloudinary.v2.uploader.UploadResult) {
    return {
      url: file.url,
      storageId: file.public_id,
      width: file.width,
      height: file.height
    };
  }
}
