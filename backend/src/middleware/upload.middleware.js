import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

// Store uploads on Cloudinary. Sub-folder by category if provided
// (e.g. riwaya/products, riwaya/equipment) — mirrors the previous local layout.
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req) => {
    const sub = (req.params.category || req.query.category || 'general')
      .toString()
      .replace(/[^a-z0-9-]/gi, '');
    return {
      folder: `riwaya/${sub}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /^image\/(jpeg|jpg|png|webp|gif)$/i;
  if (!allowed.test(file.mimetype)) {
    cb(new ApiError(400, 'Only JPG, PNG, WEBP and GIF images allowed'));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 10,
  },
});

// Single image
export const uploadSingleImage = upload.single('image');

// Multiple images (e.g. for product gallery)
export const uploadMultipleImages = upload.array('images', 10);

// Re-exported so the upload routes can delete assets by public_id.
export { cloudinary };
