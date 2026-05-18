import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("images", 6), async (req, res) => {
  try {
    const imageUrls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "listings" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      imageUrls.push(result.secure_url);
    }

    res.json({ imageUrls });
  } catch (error) {
  console.log("UPLOAD ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
});

export default router;