const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();
app.use(express.static('./dist/bm-web-client'));

app.use(createProxyMiddleware('/rest', {
  target: 'http://localhost:8080', //TODO set definitive url here
  pathRewrite: {
    "^/rest": "/api/rest/v1"
  },
  changeOrigin: true
}));
app.use(createProxyMiddleware('/ws', {
  target: 'ws://localhost:8080',
  pathRewrite: {
    "^/ws": "/api/ws/v1"
  },
  changeOrigin: true,
  ws: true
}));

app.listen(process.env.PORT || 4200)
