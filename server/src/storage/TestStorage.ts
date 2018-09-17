import * as fs from "fs";
import * as express from "express";
import Storage from "./Storage";

/**
 * Stub file response made to be compatible with both multer and CloudinaryStorage
 */
const stub = {
  public_id: "image-board/NBsz2e5Wv",
  version: 1537197602,
  signature: "fd4fd2a9b691dce171678673ce4e8b9ed88fec27",
  width: 1000,
  height: 1306,
  format: "jpg",
  resource_type: "image",
  created_at: "2018-09-17T15:20:02Z",
  tags: [],
  bytes: 115669,
  type: "upload",
  etag: "198644f91770f2ebbb3503351e2c6986",
  placeholder: false,
  url:
    "http://res.cloudinary.com/du0jftvmw/image/upload/v1537197602/image-board/NBsz2e5Wv.jpg",
  secure_url:
    "https://res.cloudinary.com/du0jftvmw/image/upload/v1537197602/image-board/NBsz2e5Wv.jpg",
  original_filename: "file"
} as any;

/**
 * Storage implementaiton for integration testing
 *
 * Does nothing and returns success.
 */
class TestStorage implements Storage {
  /**
   * Let multer upload a file
   */
  public _handleFile(
    req: express.Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ) {
    (file as any).stream.pipe(fs.createWriteStream("/dev/null"));
    callback(undefined, stub);
  }

  /**
   * Let multer delete a file
   */
  public _removeFile(
    req: express.Request,
    file: Express.Multer.File,
    callback: (error: Error) => void
  ) {
    return undefined;
  }

  /**
   * Delete file from route handler
   */
  public delete() {
    return Promise.resolve();
  }
}

export default TestStorage;
