const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();
app.use(express.static('./dist/bm-web-client'));

app.use(createProxyMiddleware('/rest', {
  target: 'https://botte-micidiali-server.herokuapp.com',
  pathRewrite: {
    "^/rest": "/api/rest/v1"
  },
  changeOrigin: true,
  secure: true
}));
app.use(createProxyMiddleware('/ws', {
  target: 'ws://botte-micidiali-server.herokuapp.com',
  pathRewrite: {
    "^/ws": "/api/ws/v1"
  },
  changeOrigin: true,
  secure: true,
}));

app.listen(process.env.PORT || 4200)
