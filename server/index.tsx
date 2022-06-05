import express from 'express';

const port = process.env.PORT || 2000;

const server = express();

server.get('/', (req, resp) => {
  resp.send(`<h1>hello</h1>`);
});

server.listen(port, () => {
  console.info(`listening on ${port}...`);
});
