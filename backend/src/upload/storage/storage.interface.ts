export abstract class StorageService {
  abstract upload(fileBuffer: Buffer, bucket: string, destinationKey: string, mimetype: string): Promise<string>;
}
