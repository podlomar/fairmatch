import { Instance, Pairing } from "stable-marriages";
import { MatchingEvent, PairingSolution } from "../common/event";

export const matchingInstanceFromEvent = (event: MatchingEvent): Instance => {
  console.log(event.blueSide);
  const prefsA = event.blueSide.parties.map(
    (party) => party.prefs.map((pref) => pref.index)
  );
  const prefsB = event.pinkSide.parties.map(
    (party) => party.prefs.map((pref) => pref.index)
  );

  return new Instance(event.size, prefsA, prefsB);
};

export const findLastEgaletarian = (solutions: PairingSolution[]): number => {
  let min = Infinity;
  let minIdx = Infinity;

  for(let i = 0; i < solutions.length; i++) {
    if (solutions[i].spread <= min) {
      min = solutions[i].spread;
      minIdx = i;
    }
  }

  return minIdx;
}

export const buildSolutions = (pairings: Pairing[]): PairingSolution[] => {
  const solutions = pairings.map((p): PairingSolution => ({
    pairs: p.pairs,
    scoreA: p.totalM,
    scoreB: p.totalW,
    totalScore: p.total,
    spread: Math.abs(p.totalM - p.totalW),
    viable: false,
    elitist: false,
    egaletarian: false,
  }));

  solutions.sort((s1, s2) => {
    if (s1.totalScore !== s2.totalScore) {
      return s2.totalScore - s1.totalScore;
    }

    return s1.spread - s2.spread;
  });

  const last = findLastEgaletarian(solutions);
  const minSpread = solutions[last].spread;
  const maxScore = solutions[0].totalScore;
  console.log(last, minSpread, maxScore);

  for (let i = 0; i <= last; i++) {
    solutions[i].viable = true;

    if (solutions[i].totalScore === maxScore) {
      solutions[i].elitist = true;
    }

    if (solutions[i].spread === minSpread) {
      solutions[i].egaletarian = true;
    }
  }

  return solutions;
};