import express from 'express';
import { renderToString } from 'react-dom/server';
import { renderHtml } from './render-html';
import App from '../common/App';
import { dehydrate, Hydrate, QueryClient, QueryClientProvider } from 'react-query';

const port = process.env.PORT || 2000;

const server = express();

server.use('/js', express.static('./js', { fallthrough: false }));

server.get('*', async (req, resp) => {
  const queryClient = new QueryClient();
  queryClient.setQueryData('greet', 'hello');
  const dehydratedState = dehydrate(queryClient);

  console.log(dehydratedState.queries[0]);

  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <App />
      </Hydrate>
    </QueryClientProvider>
  );
  resp.send(renderHtml(appHtml, dehydratedState));
});

server.listen(port, () => {
  console.info(`listening on ${port}...`);
});
