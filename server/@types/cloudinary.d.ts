declare module "cloudinary" {
  type PublicId = string;

  type Callback<T> = ((err: Error) => void) | ((err: void, result: T) => void);

  namespace cloudinary {
    interface Config {
      cloud_name?: string;
      api_key?: string;
      api_secret?: string;
      private_cdn?: string;
      secure_distribution?: string;
    }

    function config(config: Config): Config;
    function config<K extends keyof Config>(key: K, value: Config[K]): Config;

    namespace v2 {
      namespace uploader {
        // This list is incomplete, see https://cloudinary.com/documentation/image_upload_api_reference#upload
        interface UploadOptions {
          folder: string;
        }

        interface UploadResult {
          public_id: PublicId;
          url: string;
          width: number;
          height: number;
          [key: string]: any;
        }

        function upload(
          file: Buffer,
          callback?: Callback<UploadResult>,
          options?: UploadOptions
        ): Promise<UploadResult>;

        function upload_stream(
          callback: Callback<UploadResult>
        ): NodeJS.WriteStream;

        function upload_stream(
          options: UploadOptions,
          callback: Callback<UploadResult>
        ): NodeJS.WriteStream;

        // This list is incomplete
        interface DestroyOptions {
          invalidate: boolean;
        }

        interface DestroyResult {
          [key: string]: any;
        }

        function destroy(
          publicId: PublicId,
          options: DestroyOptions,
          callback?: Callback<DestroyResult>
        ): Promise<DestroyResult>;
      }
    }
  }

  export = cloudinary;
}
