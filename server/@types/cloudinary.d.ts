declare module "cloudinary" {
  const cloudinary: cloudinary.Cloudinary;

  namespace cloudinary {
    export type Cloudinary = any;
  }

  export = cloudinary;
}
