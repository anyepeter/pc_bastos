import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mediaUrl } from '@/lib/media';

/**
 * The council's Cloudflare R2 bucket, reached through its S3-compatible API.
 * Server-only: it needs R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID and
 * R2_SECRET_ACCESS_KEY, which must be set in every environment.
 */
let client: S3Client | null = null;

function bucket() {
  const { R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ENDPOINT || !R2_BUCKET || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('Image storage is not configured. Set the R2_* environment variables.');
  }
  client ??= new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
  return { s3: client, name: R2_BUCKET };
}

/**
 * Stores one object and returns its public URL. Keys are never reused — every
 * upload gets a fresh one — so the object can be cached for a year.
 */
export async function putObject(key: string, body: Uint8Array, contentType: string): Promise<string> {
  const { s3, name } = bucket();
  await s3.send(
    new PutObjectCommand({
      Bucket: name,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return mediaUrl(key);
}

export async function deleteObject(key: string): Promise<void> {
  const { s3, name } = bucket();
  await s3.send(new DeleteObjectCommand({ Bucket: name, Key: key }));
}
