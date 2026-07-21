import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || 'http://124.221.15.233:9000',
      region: process.env.S3_REGION || 'cn-beijing',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'IYn5raEN1RleeYRQwhnu',
        secretAccessKey: process.env.S3_SECRET_KEY || 'WjqCrvxZHTTS1W8Ly6wdDE5QE9zk5C1Scyjq4E43',
      },
      forcePathStyle: true,
    });
  }
  return s3Client;
}

const BUCKET = process.env.S3_BUCKET || 'fuzzsofa';
const PUBLIC_BASE_URL = process.env.S3_PUBLIC_URL || 'http://124.221.15.233:9000';

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}

export async function uploadFile(options: UploadOptions): Promise<{ url: string; key: string }> {
  const client = getS3Client();
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: options.key,
    Body: options.body,
    ContentType: options.contentType,
  }));

  return {
    key: options.key,
    url: `${PUBLIC_BASE_URL}/${BUCKET}/${options.key}`,
  };
}

export async function deleteFile(key: string): Promise<void> {
  const client = getS3Client();
  await client.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));
}

export async function listFiles(prefix?: string, maxKeys = 100): Promise<{
  files: Array<{ key: string; size: number; lastModified: Date }>;
  isTruncated: boolean;
}> {
  const client = getS3Client();
  const result = await client.send(new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
    MaxKeys: maxKeys,
  }));

  return {
    files: (result.Contents || []).map(obj => ({
      key: obj.Key!,
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
    })),
    isTruncated: result.IsTruncated || false,
  };
}

export async function getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return awsGetSignedUrl(client as any, command as any, { expiresIn });
}

export function getPublicUrl(key: string): string {
  return `${PUBLIC_BASE_URL}/${BUCKET}/${key}`;
}
