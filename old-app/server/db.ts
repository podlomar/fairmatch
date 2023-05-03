import mongoose, { HydratedDocument } from 'mongoose';
import type { Party, PartyPref, EventSide, MatchingEvent } from '../common/event';

export const PartyPrefSchema = new mongoose.Schema<PartyPref>({
  name: { type: String, required: true },
  index: { type: Number, required: true },
});

export const PartySchema = new mongoose.Schema<Party>({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  prefs: { type: [PartyPrefSchema], required: true },
  selectedPref: { type: Number },
});

export const EventSideSchema = new mongoose.Schema<EventSide>({
  name: { type: String, required: true },
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Party' }],
});

const PairingSolutionType = {
  pairs: [Number],
  scoreA: Number,
  scoreB: Number,
  totalScore: Number,
  spread: Number,
  viable: Boolean,
  elitist: Boolean,
  egaletarian: Boolean,
};

export const MatchingEventSchema = new mongoose.Schema<MatchingEvent>({
  uid: { type: String, required: true, unique: true },
  eventName: { type: String, required: true },
  size: { type: Number, required: true },
  blueSide: { type: EventSideSchema, required: true },
  pinkSide: { type: EventSideSchema, required: true },
  solutions: { type: [PairingSolutionType], required: true },
  selectedSolution: { type: Number },
});

export const PartyModel = mongoose.model<Party>('Party', PartySchema);

export const MatchingEventModel = mongoose.model<MatchingEvent>(
  'Event', MatchingEventSchema
);

export const saveEvent = async (event: MatchingEvent): Promise<HydratedDocument<MatchingEvent>> => {
  const blueParties = await Promise.all(
    event.blueSide.parties.map((party) => PartyModel.create(party))
  );

  const pinkParties = await Promise.all(
    event.pinkSide.parties.map((party) => PartyModel.create(party))
  );
  
  const dbEvent = await MatchingEventModel.create({
    ...event,
    blueSide: {
      name: event.blueSide.name,
      parties: [],
    },
    pinkSide: {
      name: event.pinkSide.name,
      parties: [],
    },
  });

  dbEvent.set('blueSide.parties', blueParties.map((party) => party._id));
  dbEvent.set('pinkSide.parties', pinkParties.map((party) => party._id));
  return dbEvent.save();
};
