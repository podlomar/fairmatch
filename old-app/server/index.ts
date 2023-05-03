import express from 'express';
import { createEventFromDef, MatchingEventDefSchema } from './event.js';
import mongoose from 'mongoose';
import { MatchingEventModel, PartyModel, saveEvent } from './db.js';
import { PartyPref } from '../common/event.js';
import { buildSolutions, matchingInstanceFromEvent } from './matching.js';
import { StablePairings } from 'stable-marriages';
import { eventFromInstance, sample } from './event-gen.js';

await mongoose.connect('mongodb://localhost:27017/fairmatchdb');

const port = process.env.PORT || 2000;

const server = express();

// server.use('/assets', express.static('./assets', { fallthrough: false }));
// server.use('/js', express.static('./js', { fallthrough: false }));

server.use(express.json());
server.use('/js', express.static('../public/js'));
server.use('/css', express.static('../public/css'));
server.use('/img', express.static('../public/img'));

server.post('/api/startEvent', async (req, resp) => {
  const parsed = MatchingEventDefSchema.safeParse(req.body);
  if (parsed.success === false) {
    resp.status(400);
    resp.send(parsed.error);
    return;
  }

  const event = await createEventFromDef(parsed.data);
  await saveEvent(event);
  resp.send(JSON.stringify(event.uid));
});

server.post('/api/testEvent', async (req, resp) => {
  const event = eventFromInstance("Testing", sample);
  await saveEvent(event);
  resp.send(JSON.stringify(event.uid));
});

server.get('/api/events/:eventId', async (req, resp) => {
  const { eventId } = req.params;
  const dbEvent = await MatchingEventModel.findOne({ uid: eventId });
  
  if (dbEvent === null) {
    resp.sendStatus(404);
    return;
  }

  await dbEvent.populate('blueSide.parties');
  await dbEvent.populate('pinkSide.parties');
  resp.send(dbEvent.toObject());
});

server.post('/api/events/:eventId/actions', async (req, resp) => {
  const { eventId } = req.params;
  const dbEvent = await MatchingEventModel.findOne({ uid: eventId });
  
  if (dbEvent === null) {
    resp.sendStatus(404);
    return;
  }

  await dbEvent.populate('blueSide.parties');
  await dbEvent.populate('pinkSide.parties');
  const event = dbEvent.toObject();

  if (req.body.type === 'find-pairings') {  
    console.log(event);
    const instance = matchingInstanceFromEvent(event);

    console.log(instance);

    const pairings = new StablePairings(instance).computeStablePairings();
    const solutions = buildSolutions(pairings);
    dbEvent.set('solutions', solutions);
    await dbEvent.save();

    resp.send(dbEvent.toObject());
    return;
  }

  if (req.body.type === 'select-solution') {
    const selectedSolution = req.body.index as number;
    const solution = event.solutions[selectedSolution];

    dbEvent.selectedSolution = selectedSolution;
    
    solution.pairs.forEach((p, b) => {
      dbEvent.blueSide.parties[b].selectedPref = p;
      dbEvent.pinkSide.parties[p].selectedPref = b;
    });
    
    await dbEvent.save();
    resp.send(dbEvent.toObject());
    return;
  }
});

server.post('/api/events/:eventId', async (req, resp) => {
  const { eventId } = req.params;
  const dbEvent = await MatchingEventModel.findOne({ uid: eventId });
  
  if (dbEvent === null) {
    resp.sendStatus(404);
    return;
  }
  
  
});

server.get('/api/parties/:partyId', async (req, resp) => {
  const { partyId } = req.params;
  const dbParty = await PartyModel.findOne({ uid: partyId });
  
  if (dbParty === null) {
    resp.sendStatus(404);
    return;
  }

  const party = dbParty.toObject();
  resp.send(party);
});

server.post('/api/parties/:partyId/prefs', async (req, resp) => {
  const { partyId } = req.params;
  const newPrefs = req.body as PartyPref[];

  const dbParty = await PartyModel.findOne({ uid: partyId });
  
  if (dbParty === null) {
    resp.sendStatus(404);
    return;
  }

  await dbParty.update({ prefs: newPrefs });
  resp.sendStatus(200);
});

server.post('/api/parties/:partyId/finalize', async (req, resp) => {
  const { partyId } = req.params;

  const dbParty = await PartyModel.findOne({ uid: partyId });
  
  if (dbParty === null) {
    resp.sendStatus(404);
    return;
  }

  dbParty.set('status', 'finalized');
  await dbParty.save();
  resp.send(dbParty.toObject());
});

server.get('*', (req, resp) => {
  resp.sendFile('index.html', { root: '../public' });
});

server.listen(port, () => {
  console.info(`listening on ${port}...`);
});
