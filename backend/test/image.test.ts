import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";
import imageRoutes from "../src/routes/imageRoutes";

// Initialize Express app with the routes
const app = express();
app.use(express.json());
app.use("/api/images", imageRoutes);

// Mock the uploads folder for testing
const mockUploadsPath = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(mockUploadsPath)) {
  fs.mkdirSync(mockUploadsPath, { recursive: true });
}

describe("Image Upload API", () => {
  afterAll(() => {
    // Clean up mock uploads folder after tests
    fs.rmSync(mockUploadsPath, { recursive: true, force: true });
  });

  describe("POST /api/images/upload", () => {
    it("should upload an image and return the image URL", async () => {
      const response = await request(app)
        .post("/api/images/upload")
        .attach("image", path.join(__dirname, "./testImage.jpg"));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("imageUrl");
      expect(response.body.imageUrl).toContain("/i/images/");
    });

    it("should return an error when no file is uploaded", async () => {
      const response = await request(app).post("/api/images/upload");

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "No file uploaded",
      });
    });
  });

  describe("Static file serving", () => {
    it("should serve uploaded images", async () => {
      // Upload a file first
      const uploadResponse = await request(app)
        .post("/api/images/upload")
        .attach("image", path.join(__dirname, "./testImage.jpg"));

      const { imageUrl } = uploadResponse.body;
      const staticFilePath = imageUrl.replace(
        "http://localhost:4000",
        ""
      );

      // Access the uploaded file via static route
      const staticResponse = await request(app).get(staticFilePath);

      expect(staticResponse.status).toBe(200);
      expect(staticResponse.header["content-type"]).toContain("image/jpeg");
    });
  });
});
