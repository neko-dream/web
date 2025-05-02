import Compressor from "compressorjs";

/**
 * 画像を小さくする
 */
export const fileCompress = async (
  file?: File | Blob,
  size = 300,
): Promise<File | Blob | undefined> => {
  if (!(file && file.size <= 0)) {
    return undefined;
  }

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
