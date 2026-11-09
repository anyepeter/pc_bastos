/**
 * Shrinks a photo in the browser before it is uploaded.
 *
 * Phone photos run to several megabytes, while a server action accepts at
 * most about 4 MB (Vercel's limit), and the site never shows an image wider
 * than about 1600 px. Scaling here keeps uploads fast on slow connections and
 * keeps the bucket lean. Drawing through a canvas also applies the photo's
 * EXIF rotation and drops its metadata, GPS position included.
 *
 * Opaque images become JPEG. Images with transparency, such as logos, stay
 * PNG. GIFs are sent untouched so animations survive. If anything goes wrong,
 * or the result is not smaller, the original file is sent and the server's own
 * checks decide.
 */
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  if (typeof createImageBitmap !== 'function') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const transparent = file.type !== 'image/jpeg' && hasTransparency(context, width, height);
    const type = transparent ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, transparent ? undefined : JPEG_QUALITY)
    );

    // A small, already-compressed file can come out bigger; keep the original.
    if (!blob || (blob.size >= file.size && scale === 1)) return file;

    const base = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${base}.${transparent ? 'png' : 'jpg'}`, { type });
  } catch {
    return file;
  }
}

function hasTransparency(context: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = context.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}
