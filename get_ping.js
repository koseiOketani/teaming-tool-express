const http = require('http');

const options = {
  hostname: '122.208.16.184',
  port: 80,
  path: '/ping',
  method: 'GET',
  timeout: 5000 // 5秒でタイムアウト
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('timeout', () => {
  console.error('Error: Request timed out');
  req.abort();
});

req.on('error', error => {
  console.error('Error:', error);
});

req.end();
