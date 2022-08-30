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