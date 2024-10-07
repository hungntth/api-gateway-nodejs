const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

// Define backend servers
const servers = [
  { url: 'http://localhost:3001' },
  { url: 'http://localhost:3002' },
  { url: 'http://localhost:3003' },
];

// Function to check server health
const checkServerHealth = async (url) => {
  try {
    await axios.get(url); // Gửi request GET để kiểm tra server
    return true; // Server khả dụng
  } catch (err) {
    return false; // Server không khả dụng
  }
};

// Create proxy middleware
const proxy = createProxyMiddleware({
  changeOrigin: true,
  xfwd: true,
  router: async (req) => {
    // Check servers in round-robin manner
    let server;
    for (let i = 0; i < servers.length; i++) {
      server = servers.shift(); // Lấy server từ danh sách
      servers.push(server); // Đẩy server này vào cuối danh sách để giữ thứ tự round-robin
      const isHealthy = await checkServerHealth(server.url); // Kiểm tra server này có khả dụng không
      if (isHealthy) {
        return server.url; // Trả về URL của server khả dụng
      }
    }
    return null; // Không có server nào khả dụng
  },
  onError: (err, req, res) => {
    res.writeHead(502, {
      'Content-Type': 'text/plain',
    });
    res.end('No healthy servers available.');
  },
});

// Create load balancer server
const server = http.createServer((req, res) => {
  proxy(req, res);
});

const port = process.env.PORT || 4004;
server.listen(port, () => {
  console.log(`Load balancer running on port ${port}`);
});
