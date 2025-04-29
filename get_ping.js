const http = require('http');
const { exec } = require('child_process');
const axios = require('axios');

http.get('http://example.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
}).on('error', err => {
  console.error('Error:', err);
});

exec('curl http://122.208.16.184/ping', (err, stdout, stderr) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
});

axios.get('http://122.208.16.184/ping')
  .then(res => {
    console.log('Status:', res.status);
    console.log('Response:', res.data);
  })
  .catch(err => {
    console.error('Error:', err);
  });

const options = {
  hostname: '122.208.16.184',
  port: 80,
  path: '/ping',
  method: 'GET',
  localAddress: '122.208.16.184'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});
req.on('error', err => {
  console.error('Error:', err);
});
req.end();
