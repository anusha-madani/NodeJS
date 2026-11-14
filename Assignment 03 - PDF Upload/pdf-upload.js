const http = require("http");
const fs = require("fs");
const path = require("path");
const formidableLib = require("formidable");
const formidable = formidableLib.formidable || formidableLib;

const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const formPage = `
<h1>Upload a PDF Document</h1>
<form action="/upload" method="post" enctype="multipart/form-data">
  <p><input type="text" name="title" placeholder="Title"></p>
  <p><input type="file" name="myfile" accept=".pdf"></p>
  <button type="submit">Upload</button>
</form>`;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(formPage);

  } else if (req.method === "POST" && req.url === "/upload") {
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 1 * 1024 * 1024, 
      filter: ({ name, originalFilename, mimetype }) => {
        return Boolean(mimetype && mimetype === "application/pdf");
      },
    });

    form.parse(req, (error, fields, files) => {
      res.setHeader("Content-Type", "text/plain");

      if (error) {
        res.statusCode = error.httpCode || 400;
        res.end("Upload failed: " + error.message);
        return;
      }

      const file  = Array.isArray(files.myfile) ? files.myfile[0] : files.myfile;
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;

      if (!file) {
        res.statusCode = 400;
        res.end("Only PDF files are allowed");
        return;
      }

      const sizeInKB = (file.size / 1024).toFixed(1);

      console.log("Saved:", file.newFilename, "| original:", file.originalFilename, "|", sizeInKB, "KB");
      res.statusCode = 200;
      res.end(
        `Upload successful!\nTitle: ${title || ""}\nOriginal name: ${file.originalFilename}\nSaved as: ${file.newFilename}\nSize: ${sizeInKB} KB`
      );
    });

  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page not found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});