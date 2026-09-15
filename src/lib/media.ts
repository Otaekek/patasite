export function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(src)
}
