import { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import { useParams } from 'react-router';
import type { Party, PartyPref } from '../../../common/event';
import PrefPanel from './components/PrefPanel';
import './style.scss';

interface PrefsListProps {
  locked: boolean,
  prefs: PartyPref[];
};

const PrefsList = SortableContainer<PrefsListProps>(
  ({ locked, prefs }: PrefsListProps): JSX.Element => (
    <div>
      { prefs.map((pref, index) => (
        <PrefPanel locked={locked} key={`item-${pref.index}`} index={index} name={pref.name} />
      ))}
    </div>
  )
);

const PartyPage = () => {
  const [party, setParty] = useState<Party | 'loading'>('loading');
  const { partyId } = useParams();

  useEffect(() => {
    (async () => setParty(
      await (await fetch(`/api/parties/${partyId}`)).json() as Party
    ))();
  }, []);

  const handleSortEnd = ({ oldIndex, newIndex }: SortEnd): void => {
    if (party === 'loading') {
      return;
    }

    const prefs = arrayMove(party.prefs, oldIndex, newIndex);
    setParty({ ...party, prefs });
    
    fetch(`/api/parties/${partyId}/prefs`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prefs),
    });
  };

  const handleFinalize = async () => {
    setParty(
      await (await fetch(`/api/parties/${partyId}/finalize`, { method: 'POST' })).json()
    );
  };

  console.log(party);

  return (
    <main className="container-sm">
      { party === 'loading' ? (
        <p>loading...</p>
      ) : (
        <>
          <p>{ party.name='' }</p>
          <PrefsList 
            shouldCancelStart={() => party.status === 'finalized'}
            prefs={party.prefs} onSortEnd={handleSortEnd}
            locked={party.status === 'finalized'}
          />
          <button onClick={handleFinalize}>Finalize</button>
        </>
      )}
    </main>
  );
};

export default PartyPage;