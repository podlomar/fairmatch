import express from 'express';
import { renderToString } from 'react-dom/server';
import App from '../common/App';


const port = process.env.PORT || 2000;

const server = express();

server.get('/', (req, resp) => {
  const appHtml = renderToString(<App />);
  
  resp.send(appHtml);
});

server.listen(port, () => {
  console.info(`listening on ${port}...`);
});
