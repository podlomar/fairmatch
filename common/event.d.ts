export interface PartyPref {
  index: number,
  name: string,
}

export interface Party {
  uid: string,
  name: string,
  status: 'in-progress' | 'finalized';
  prefs: PartyPref[],
}

export interface EventSide {
  name: string,
  parties: Party[],
}

export interface PairingSolution {
  pairs: number[],
  scoreA: number,
  scoreB: number,
  totalScore: number,
  spread: number,
  viable: boolean,
  elitist: boolean,
  egaletarian: boolean,
}

export interface MatchingEvent {
  uid: string,
  eventName: string,
  size: number,
  blueSide: EventSide,
  pinkSide: EventSide,
  solutions: PairingSolution[],
  selectedSolution?: number,
}