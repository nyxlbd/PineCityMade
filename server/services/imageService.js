const getStorageProvider = () => process.env.IMAGE_STORAGE_PROVIDER || 'local';

export const buildImageUrl = (fileName) => {
  const provider = getStorageProvider();

  if (provider === 'cloudinary') {
    const cloudName = process.env.IMAGE_STORAGE_CLOUD_NAME || 'demo';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${fileName}`;
  }

  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return `${serverUrl}/uploads/${fileName}`;
};

export const attachImageMetadata = async (file) => {
  if (!file) {
    return null;
  }

  return {
    url: buildImageUrl(file.filename),
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    provider: getStorageProvider(),
  };
};
