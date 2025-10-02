// types/cloudinary.d.ts
declare module "cloudinary" {
  export namespace v2 {
    export function config(options: {
      cloud_name?: string;
      api_key?: string;
      api_secret?: string;
    }): void;
    export namespace uploader {
      export function upload(
        file: string | Buffer | File,
        options?: { upload_preset?: string; [key: string]: any }
      ): Promise<{ secure_url: string; [key: string]: any }>;
    }
  }
}
