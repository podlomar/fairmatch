import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import type { MatchingEvent, PairingSolution } from '../../../common/event';
import './style.scss';

const EventPage = () => {
  const [event, setEvent] = useState<MatchingEvent | 'loading'>('loading');
  const { eventId } = useParams();
  
  console.log('event', event);

  useEffect(() => {
    (async () => setEvent(
      await (await fetch(`/api/events/${eventId}`)).json() as MatchingEvent
    ))();
  }, []);

  const handleComputePairings = async () => {
    setEvent(await (
      await fetch(`/api/events/${eventId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'find-pairings'}),
      }
    )).json() as MatchingEvent);
  }

  return (
    <main className="container-sm">
      { event === 'loading' ? (
        <p>loading...</p>
      ) : (
        <>
          <p>{ event.eventName }</p>
          <div className="row">
            <div className="col">
              {
                event.blueSide.parties.map((party) => (
                  <div className="party-panel">
                    <div className="party-panel--icon" />
                    <div className="party-panel--name">
                      <div>{ party.name } { party.status === 'finalized' ? 'done' : null } </div>
                      <Link to={`/parties/${party.uid}`}>{`${window.location.origin}/parties/${party.uid}`}</Link>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="col">
              {
                event.pinkSide.parties.map((party) => (
                  <div className="party-panel">
                    <div className="party-panel--icon" />
                    <div className="party-panel--name">
                      <div>{ party.name } { party.status === 'finalized' ? 'done' : null } </div>
                      <Link to={`/parties/${party.uid}`}>{`${window.location.origin}/parties/${party.uid}`}</Link>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <button onClick={handleComputePairings}>Pairings</button>
          <div>
            {
              event.solutions.map((solution) => (
                <div>
                  { solution.scoreA }
                  { solution.totalScore }
                  { solution.scoreB }
                  <button>select</button>
                </div>
              ))
            }
          </div>
        </>  
      )}
    </main>
  );
};

export default EventPage;