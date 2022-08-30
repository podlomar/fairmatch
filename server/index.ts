import express from 'express';
import { createEventFromDef, MatchingEventDefSchema } from './event.js';
import type { MatchingEvent } from '../common/event';

const events: MatchingEvent[] = [
  {
    "id": "0x0-gO1R",
    "eventName": "Test Matching 1",
    "size": 5,
    "sideA": {
      "name": "Men",
      "parties": [
        {
          "id": "YqL8v3",
          "name": "Paul",
          "prefs": [
            {
              "name": "Susan",
              "index": 0
            },
            {
              "name": "Evelyn",
              "index": 1
            },
            {
              "name": "Abigail",
              "index": 4
            },
            {
              "name": "Camila",
              "index": 2
            },
            {
              "name": "Michelle",
              "index": 3
            }
          ]
        },
        {
          "id": "OgOnR7",
          "name": "Raymond",
          "prefs": [
            {
              "name": "Michelle",
              "index": 3
            },
            {
              "name": "Abigail",
              "index": 4
            },
            {
              "name": "Evelyn",
              "index": 1
            },
            {
              "name": "Camila",
              "index": 2
            },
            {
              "name": "Susan",
              "index": 0
            }
          ]
        },
        {
          "id": "5hRNCt",
          "name": "Charles",
          "prefs": [
            {
              "name": "Abigail",
              "index": 4
            },
            {
              "name": "Michelle",
              "index": 3
            },
            {
              "name": "Camila",
              "index": 2
            },
            {
              "name": "Evelyn",
              "index": 1
            },
            {
              "name": "Susan",
              "index": 0
            }
          ]
        },
        {
          "id": "Fw-K6J",
          "name": "Nathan",
          "prefs": [
            {
              "name": "Susan",
              "index": 0
            },
            {
              "name": "Abigail",
              "index": 4
            },
            {
              "name": "Michelle",
              "index": 3
            },
            {
              "name": "Camila",
              "index": 2
            },
            {
              "name": "Evelyn",
              "index": 1
            }
          ]
        },
        {
          "id": "JkF-kG",
          "name": "Matthew",
          "prefs": [
            {
              "name": "Michelle",
              "index": 3
            },
            {
              "name": "Evelyn",
              "index": 1
            },
            {
              "name": "Susan",
              "index": 0
            },
            {
              "name": "Abigail",
              "index": 4
            },
            {
              "name": "Camila",
              "index": 2
            }
          ]
        }
      ]
    },
    "sideB": {
      "name": "Women",
      "parties": [
        {
          "id": "bP_-SV",
          "name": "Susan",
          "prefs": [
            {
              "name": "Paul",
              "index": 0
            },
            {
              "name": "Raymond",
              "index": 1
            },
            {
              "name": "Charles",
              "index": 2
            },
            {
              "name": "Matthew",
              "index": 4
            },
            {
              "name": "Nathan",
              "index": 3
            }
          ]
        },
        {
          "id": "VJlWJd",
          "name": "Evelyn",
          "prefs": [
            {
              "name": "Paul",
              "index": 0
            },
            {
              "name": "Nathan",
              "index": 3
            },
            {
              "name": "Raymond",
              "index": 1
            },
            {
              "name": "Matthew",
              "index": 4
            },
            {
              "name": "Charles",
              "index": 2
            }
          ]
        },
        {
          "id": "04Rfl-",
          "name": "Camila",
          "prefs": [
            {
              "name": "Matthew",
              "index": 4
            },
            {
              "name": "Charles",
              "index": 2
            },
            {
              "name": "Raymond",
              "index": 1
            },
            {
              "name": "Nathan",
              "index": 3
            },
            {
              "name": "Paul",
              "index": 0
            }
          ]
        },
        {
          "id": "ZAdHK5",
          "name": "Michelle",
          "prefs": [
            {
              "name": "Nathan",
              "index": 3
            },
            {
              "name": "Matthew",
              "index": 4
            },
            {
              "name": "Paul",
              "index": 0
            },
            {
              "name": "Charles",
              "index": 2
            },
            {
              "name": "Raymond",
              "index": 1
            }
          ]
        },
        {
          "id": "a0bLWD",
          "name": "Abigail",
          "prefs": [
            {
              "name": "Raymond",
              "index": 1
            },
            {
              "name": "Matthew",
              "index": 4
            },
            {
              "name": "Charles",
              "index": 2
            },
            {
              "name": "Paul",
              "index": 0
            },
            {
              "name": "Nathan",
              "index": 3
            }
          ]
        }
      ]
    }
  }
];

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

  const event = createEventFromDef(parsed.data);
  events.push(event);
  resp.send(event);
});

server.get('/api/event/:id', async (req, resp) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === id);
  
  if (event === undefined) {
    resp.sendStatus(404);
    return;
  }

  console.log(JSON.stringify(event, null, 2));
  resp.send(event);
});

server.get('/api/event/:eventId/party/:partyId', async (req, resp) => {
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

server.get('*', (req, resp) => {
  resp.sendFile('index.html', { root: '../public' });
});

server.listen(port, () => {
  console.info(`listening on ${port}...`);
});
