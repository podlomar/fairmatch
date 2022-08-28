import collect from 'collect.js';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const EventSideSchema = z.object({
  name: z.string(),
  parties: z.array(z.string()),
});

export const MatchingEventDefSchema = z.object({
  eventName: z.string(),
  size: z.number(),
  sideA: EventSideSchema,
  sideB: EventSideSchema,
});

export type MatchingEventDef = z.infer<typeof MatchingEventDefSchema>;

export interface PartyPref {
  index: number,
  name: string,
}

export interface Party {
  id: string,
  name: string,
  prefs: PartyPref[],
}

export interface EventSide {
  name: string,
  parties: Party[],
}

export interface MatchingEvent {
  id: string,
  eventName: string,
  size: number,
  sideA: EventSide,
  sideB: EventSide,
}

const prefFromPartyNames = (names: string[]): PartyPref[] => {
  const prefs = names.map((name, index): PartyPref => ({ name, index }));
  return collect(prefs).shuffle().all();
}

export const createEventFromDef = (def: MatchingEventDef): MatchingEvent => {
  const range = new Array(def.size).fill(null);
  const sideA: EventSide = {
    name: def.sideA.name,
    parties: def.sideA.parties.map((partyName): Party => ({
      id: nanoid(6),
      name: partyName,
      prefs: prefFromPartyNames(def.sideB.parties),
    })),
  };
  
  const sideB: EventSide = {
    name: def.sideB.name,
    parties: def.sideB.parties.map((partyName): Party => ({
      id: nanoid(6),
      name: partyName,
      prefs: prefFromPartyNames(def.sideA.parties),
    })),
  };

  return { 
    id: nanoid(8),
    eventName: def.eventName,
    size: def.size,
    sideA, 
    sideB,
  };
};