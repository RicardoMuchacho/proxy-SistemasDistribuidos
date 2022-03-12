const express = require('express');
const compression = require('compression');
const https = require('https');
const fs = require('fs');
const morgan = require('morgan');
const fetch = require('node-fetch');
const { createProxyMiddleware } = require('http-proxy-middleware')
const HOST = 'localhost';
const PORT = process.env.PORT || 4000;
const TARGET = process.env.TARGET || 'http://localhost:3000';

const app = express();
app.use(morgan('dev'));

// Compress all HTTP responses
app.use(compression());

app.use('/animals', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
}));

app.use(express.json());

app.get('/info', async (req, res, next) => {
  return res.send("proxy working")
});

app.listen(PORT, HOST, () => {
  console.log(`Proxy running at http://${HOST}:${PORT}/`);
});
