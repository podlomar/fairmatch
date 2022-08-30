import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import type { MatchingEvent } from '../../../common/event';
import './style.scss';

const HomePage = () => {
  const [event, setEvent] = useState<MatchingEvent | 'loading'>('loading');
  const { eventId } = useParams();
  
  useEffect(() => {
    (async () => setEvent(
      await (await fetch(`/api/event/${eventId}`)).json() as MatchingEvent
    ))();
  }, []);

  return (
    <main className="container-sm">
      { event === 'loading' ? (
        <p>loading...</p>
      ) : (
        <>
          <p>{ event.eventName }</p>
          <div>
            {
              event.sideA.parties.map((party) => (
                <div className="event-panel">
                  <div>{ party.name }</div>
                  <Link to={`party/${party.id}`}>{`${window.location.href}/party/${party.id}`}</Link>
                </div>
              ))
            }
          </div>
        </>
      )}
    </main>
  );
};

export default HomePage;