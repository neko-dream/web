import Compressor from "compressorjs";

/**
 * 画像を小さくする
 */
export const fileCompress = (
  file: File | Blob,
  size = 300,
): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: size,
      maxHeight: size,
      success(normalizedFile) {
        resolve(normalizedFile);
      },
      error(error) {
        reject(error);
      },
    });
  });
};
