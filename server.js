const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./public/js/data.js'); // data.js에서 config 가져오기
const path = require('path'); // path 모듈을 불러오기
const app = express();
const port = 3000;



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/view/swagger.html'));
});

// /login 경로를 외부 서버로 프록시 설정
// app.use('/login', createProxyMiddleware({
//     // target: 'http://15.165.166.179:8082',  
//     target: 'http://127.0.0.1:8082',  
//     changeOrigin: true,  
//     pathRewrite: pathRewrite,
//     onProxyReq: (proxyReq, req, res) => {
//         console.log('Proxying request to:', proxyReq.path); // 디버깅용 로그
//       },
//   }));


// config.apiData.forEach(api => {
//     app.use(api.uri, createProxyMiddleware({
//         target: 'http://127.0.0.1:8082',
//         changeOrigin: true,
//         pathRewrite: {
//             [`^${api.uri}`]: api.uri // 로컬 경로를 외부 서버의 경로로 매핑
//         },
//         logLevel: 'debug', // 디버깅을 위한 로그 레벨 설정
//         onProxyReq: (proxyReq, req, res) => {
//             console.log(`Proxying request to: ${api.uri}`);
//             console.log('Request headers:', req.headers); // 요청 헤더 출력

//             // 인증이 필요한 경우, 인증 헤더를 추가합니다.
//             if (api.authorization) {
//                 proxyReq.setHeader('Authorization', 'Bearer YOUR_ACCESS_TOKEN');
//             }
//         },
//         onError: (err, req, res) => {
//             console.error('Proxy error:', err); // 에러 발생 시 로그 출력
//             res.status(500).send('Proxy error occurred');
//         },
//     }));
// });

config.apiData.forEach(api => {
    app.use(api.uri, createProxyMiddleware({
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        pathRewrite: {
            [`^${api.uri}`]: api.uri // 로컬 경로를 외부 서버의 경로로 매핑
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log('Proxying request to:', proxyReq.path);
            console.log('Request headers:', req.headers);
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error occurred');
        }
    }));
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});