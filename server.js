const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./public/js/data.js'); // data.js에서 config 가져오기
const path = require('path'); // path 모듈을 불러오기
const WebSocket = require('ws');
const http = require('http');
const app = express();
const port = 3000;

app.use('/api',
    createProxyMiddleware({
    
    target: 'http://127.0.0.1:8082',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },  onProxyReq: (proxyReq, req, res) => {
            console.log('Proxying request to:', proxyReq.path);
            console.log('Request headers:', req.headers);
            console.log(res);
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error occurred');
        }
  }));

app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

// WebSocket 연결 핸들러
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        // 클라이언트로 메시지 전송
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

app.use('/login', (req, res, next) => {
    console.log('로그인 경로에 대한 요청이 프록시로 전달되기 전에 호출됨');
    next();
  });

app.get('/', (req, res) => {
    console.log("main으로 왓음");
  res.sendFile(path.join(__dirname, 'public/view/swagger.html'));
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});