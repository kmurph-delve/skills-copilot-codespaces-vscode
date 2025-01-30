// Create web server
// Run with node comments.js
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const comments = [];

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  if (pathname === '/' || pathname === '/index.html') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (pathname === '/comments') {
    if (req.method === 'GET') {
      const query = querystring.parse(url.parse(req.url).query);
      const { comment } = query;
      if (comment) {
        comments.push(comment);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const query = querystring.parse(body);
        const { comment } = query;
        if (comment) {
          comments.push(comment);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comments));
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://