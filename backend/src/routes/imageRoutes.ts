import express, { Request } from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Set up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req: Request, res: any) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `http://localhost:4000/i/images/${req.file.filename}`;  
    res.status(200).json({
      imageUrl: fileUrl,
    });
});

console.log(path.join(__dirname, "../../uploads/images"))

router.use("/images", express.static(path.join(__dirname, "../../uploads/images")));


export default router;
