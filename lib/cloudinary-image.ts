/**
 * Cropped variants of Cloudinary uploads, made by inserting a transformation
 * into the URL. Images hosted anywhere else are returned unchanged and cropped
 * by CSS instead. Safe to import from client and server alike.
 */
export function cloudinaryVariant(url: string, transform: string): string {
  const marker = '/image/upload/';
  const at = url.indexOf(marker);
  if (!url.includes('res.cloudinary.com') || at === -1) return url;
  const head = url.slice(0, at + marker.length);
  return `${head}${transform}/${url.slice(at + marker.length)}`;
}

/** Square crop centred on the face, for small round portraits. */
export const faceAvatar = (url: string) =>
  cloudinaryVariant(url, 'c_thumb,g_face,z_0.7,w_256,h_256,q_auto,f_auto');
