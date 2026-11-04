const http = require('http');

const courses = [
  { id: 1, title: 'HTML Basics', level: 'beginner', hours: 10 },
  { id: 2, title: 'JavaScript Essentials', level: 'beginner', hours: 20 },
  { id: 3, title: 'Node.js Server', level: 'intermediate', hours: 24 },
  { id: 4, title: 'Advanced MongoDB', level: 'advanced', hours: 30 }
];

const server = http.createServer((req, res) => {
  const Url = new URL(req.url, 'http://localhost:3000');
  console.log(req.method, Url.pathname, Url.search);

  if (Url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Course API</h1><p>endpoints: /about, /api/courses, /api/greet, /api/add</p>');
  } 
  else if (Url.pathname === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Course API v1 built with Node.js');
  } 
  else if (Url.pathname === '/api/courses') {
    const lvl = Url.searchParams.get('level');

    if (lvl) {
      const data = courses.filter(c => c.level === lvl);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(courses));
    }
  } 
  else if (Url.pathname === '/api/greet') {
    const name = Url.searchParams.get('name');
    const city = Url.searchParams.get('city') || 'Turkey';

    if (!name) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Name is Required' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Hello ${name} from ${city}` }));
    }
  } 
  else if (Url.pathname === '/api/add') {
    const num1 = Url.searchParams.get('a');
    const num2 = Url.searchParams.get('b');

    if (!num1 || !num2) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'a and b must be numbers' }));
    } else {
      const a = Number(num1);
      const b = Number(num2);

      if (isNaN(a) || isNaN(b)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'a and b must be numbers' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            a: a, 
            b: b, 
            sum: a + b
         }));
      }
    }
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});