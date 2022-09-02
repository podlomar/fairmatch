import { nanoid } from "nanoid";
import { Instance } from "stable-marriages";
import type { MatchingEvent, Party, PartyPref } from "../common/event";
import { boyNames, girlNames } from "./names.js";

export const sample = new Instance(
  5,
  [
    [ 4, 2, 1, 3, 0 ],
    [ 0, 2, 1, 4, 3 ],
    [ 3, 1, 4, 2, 0 ],
    [ 4, 1, 3, 0, 2 ],
    [ 2, 4, 1, 0, 3 ]
  ],
  [
    [ 2, 0, 4, 3, 1 ],
    [ 4, 2, 1, 3, 0 ],
    [ 3, 2, 0, 4, 1 ],
    [ 1, 3, 0, 4, 2 ],
    [ 2, 4, 0, 3, 1 ]
  ]
);

export const prefsFromNames = (
  names: string[], indices: number[]
): PartyPref[] => indices.map((index): PartyPref => ({
    name: names[index],
    index,
  })
);

export const eventFromInstance = (name: string, instance: Instance): MatchingEvent => {
  const blueNames = boyNames.slice(0, instance.size);
  const pinkNames = girlNames.slice(0, instance.size);

  const blueParties = blueNames.map((name, i): Party => {
    return {
      uid: nanoid(),
      name,
      status: 'in-progress',
      prefs: prefsFromNames(pinkNames, instance.prefsM[i]),
    }
  });

  const pinkParties = pinkNames.map((name, i): Party => {
    return {
      uid: nanoid(),
      name,
      status: 'in-progress',
      prefs: prefsFromNames(blueNames, instance.prefsW[i]),
    }
  });

  return {
    uid: nanoid(),
    eventName: name,
    size: instance.size,
    blueSide: {
      name: "Boys",
      parties: blueParties,
    },
    pinkSide: {
      name: "Girls",
      parties: pinkParties,
    },
    solutions: [],
  };
}