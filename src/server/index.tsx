import express from 'express';
import { renderToString } from 'react-dom/server';
import { renderHtml } from './render-html';
import App from '../common/App';
import { StrictMode } from 'react';

const port = process.env.PORT || 2000;

const server = express();

server.use('/js', express.static('./js', { fallthrough: false }));

server.get('*', (req, resp) => {
  const appHtml = renderToString(
    <App />
  );
  resp.send(renderHtml(appHtml));
});

server.listen(port, () => {
  console.info(`listening on ${port}...`);
});
