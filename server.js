const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // ---------- SERVE FRONTEND FILES ----------
    let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);

    const ext = path.extname(filePath);
    let contentType = "text/html";

    if (ext === ".css") contentType = "text/css";
    if (ext === ".js") contentType = "text/javascript";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";

    fs.readFile(filePath, (err, content) => {
        if (!err) {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });

    // ---------- CONTACT FORM API ----------
    if (req.method === "POST" && req.url === "/save-contact") {
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const d = JSON.parse(body);

            const text =
                `Name: ${d.name}\n` +
                `Email: ${d.email}\n` +
                `Message: ${d.message}\n` +
                `----------------------\n`;

            fs.appendFileSync("contact_data.txt", text);
            res.end("Message saved successfully!");
        });
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
