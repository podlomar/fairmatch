import express from 'express';
import fileUpload from 'express-fileupload';
import { renderToString } from 'react-dom/server';
import { renderHtml } from './render-html';
import App from '../common/App';
import { dehydrate, Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import yaml from 'yaml';
import { createEventFromDef, MatchingEvent, MatchingEventDefSchema } from './event';

const events: MatchingEvent[] = [];

const port = process.env.PORT || 2000;

const server = express();

server.use('/assets', express.static('./assets', { fallthrough: false }));
server.use('/js', express.static('./js', { fallthrough: false }));

server.use(fileUpload());

server.get('/', async (req, resp) => {
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

server.post('/startEvent', async (req, resp) => {
  if (req.files === null || req.files === undefined ){
    resp.sendStatus(400);
    return;
  }
  
  // @ts-ignore
  const fileContent = req.files.defFile.data.toString('utf-8');
  const parsed = MatchingEventDefSchema.safeParse(yaml.parse(fileContent));
  
  if (!parsed.success) {
    resp.status(400);
    resp.send(parsed.error);
    return;
  }

  const event = createEventFromDef(parsed.data);
  events.push(event);
  
  console.log(event);
  resp.redirect(`/event/${event.id}`);
});

server.get('/event/:id', async (req, resp) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === id);
  
  if (event === undefined) {
    resp.sendStatus(404);
    return;
  }

  resp.send(event);
});

server.get('/event/:eventId/:partyId', async (req, resp) => {
  const { eventId, partyId } = req.params;
  const event = events.find((e) => e.id === eventId);
  
  if (event === undefined) {
    resp.sendStatus(404);
    return;
  }

  const party = (
    event.sideA.parties.find((p) => p.id === partyId) ??
    event.sideB.parties.find((p) => p.id === partyId)
  );
  
  if (party === undefined) {
    resp.sendStatus(404);
    return;
  }

  resp.send(party);
});

server.listen(port, () => {
  console.info(`listening on ${port}...`);
});
