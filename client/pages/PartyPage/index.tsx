import { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import { useParams } from 'react-router';
import type { Party, PartyPref } from '../../../common/event';
import PrefPanel from './components/PrefPanel';
import './style.scss';

interface PrefsListProps {
  prefs: PartyPref[];
};

const PrefsList = SortableContainer<PrefsListProps>(
  ({ prefs }: PrefsListProps): JSX.Element => (
    <div>
      { prefs.map((pref, index) => (
        <PrefPanel key={`item-${pref.index}`} index={index} name={pref.name} pos={index+1} />
      ))}
    </div>
  )
);

const PartyPage = () => {
  const [party, setParty] = useState<Party | 'loading'>('loading');
  const { eventId, partyId } = useParams();

  useEffect(() => {
    (async () => setParty(
      await (await fetch(`/api/event/${eventId}/party/${partyId}`)).json() as Party
    ))();
  }, []);

  const handleSortEnd = ({ oldIndex, newIndex }: SortEnd): void => {
    if (party === 'loading') {
      return;
    }

    const prefs = arrayMove(party.prefs, oldIndex, newIndex);
    setParty({ ...party, prefs });
  };

  return (
    <main className="container-sm">
      { party === 'loading' ? (
        <p>loading...</p>
      ) : (
        <>
          <p>{ party.name='' }</p>
          <PrefsList prefs={party.prefs} onSortEnd={handleSortEnd} />
        </>
      )}
    </main>
  );
};

export default PartyPage;