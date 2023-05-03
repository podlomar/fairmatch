import collect from 'collect.js';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { MatchingEvent, EventSide, Party, PartyPref } from '../common/event';

const EventSideSchema = z.object({
  name: z.string(),
  parties: z.array(z.string()),
});

export const MatchingEventDefSchema = z.object({
  eventName: z.string(),
  size: z.number(),
  blueSide: EventSideSchema,
  pinkSide: EventSideSchema,
});

export type MatchingEventDef = z.infer<typeof MatchingEventDefSchema>;

const prefFromPartyNames = (names: string[]): PartyPref[] => {
  const prefs = names.map((name, index): PartyPref => ({ name, index }));
  return collect(prefs).shuffle().all();
}

export const createEventFromDef = async (def: MatchingEventDef): Promise<MatchingEvent> => {
  const blueSideParties = def.blueSide.parties.map(
    (partyName: string): Party => ({
      uid: nanoid(),
      name: partyName,
      status: 'in-progress',
      prefs: prefFromPartyNames(def.pinkSide.parties)
    })
  );

  const pinkSideParties = def.pinkSide.parties.map(
    (partyName: string): Party => ({
      uid: nanoid(),
      name: partyName,
      status: 'in-progress',
      prefs: prefFromPartyNames(def.blueSide.parties)
    })
  );

  return {
    uid: nanoid(),
    eventName: def.eventName,
    size: def.size,
    blueSide: {
      name: def.blueSide.name,
      parties: blueSideParties,
    },
    pinkSide: {
      name: def.pinkSide.name,
      parties: pinkSideParties,
    },
    solutions: [],
  };
};
