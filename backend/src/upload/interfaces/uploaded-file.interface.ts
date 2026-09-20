export interface StrictUploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  fieldname: string;
  encoding: string;
}
