const express = require("express");
const client = require("prom-client");

const app = express();

const startMetrics = () => {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  // Thu thập các metric mặc định từ hệ thống
  collectDefaultMetrics();
  

  // Custom metric để lưu phiên bản Node.js
  const nodeVersionGauge = new client.Gauge({
    name: "nodejs_version_api_gateway_info",
    help: "Node.js version info",
    labelNames: ["version"],
  });

  // Thiết lập giá trị metric với phiên bản hiện tại của Node.js
  nodeVersionGauge.labels('v20.12.3').set(1);


  // Endpoint `/metrics`
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    return res.send(await client.register.metrics());
  });

  app.listen(9009, () => {
    console.log("startMetrics::9009");
    console.log(process.version);
  });
};

module.exports = { startMetrics };
