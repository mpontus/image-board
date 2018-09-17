import * as express from "express";
import Storage from "./Storage";

/**
 * Stub file response made to be compatible with both multer and CloudinaryStorage
 */
const stub = {
  filename: "123.jpg",
  public_id: "123",
  url: "https://picsum.photos/1920/1080/?image=791",
  width: 1280,
  height: 1024
};

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
    callback(null, stub);
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
