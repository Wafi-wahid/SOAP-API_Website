const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.text({ type: "text/xml" }));

app.post("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  const soapAction = req.query.action;

  if (!targetUrl) {
    return res.status(400).send("Missing target URL");
  }

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        ...(soapAction && { SOAPAction: soapAction }),
      },
      body: req.body,
    });

    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send(error.toString());
  }
});

app.use(express.static("."));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
