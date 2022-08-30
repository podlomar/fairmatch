import { SortableElement } from 'react-sortable-hoc';
import './style.scss';

interface Props {
  name: string;
  pos: number;
};


const PrefPanel = ({ name }: Props): JSX.Element => {
  return (
    <div className="pref-panel">
      <div className="pref-panel__icon" />
      <div className="pref-panel__name">{name}</div>
    </div>
  );
}

// interface PrefsListProps {
//   prefs: PartyPref[];
// };

// const PrefsList = SortableContainer<PrefsListProps>(
//   ({ prefs }: PrefsListProps): JSX.Element => (
//     <div>
//       { prefs.map((pref, index) => (
//         <PrefPanel key={`item-${pref.index}`} index={index} name={pref.name} />
//       ))}
//     </div>
//   )
// );

// const PartyPage = () => {
//   const [party, setParty] = useState<Party | 'loading'>('loading');
//   const { eventId, partyId } = useParams();

//   useEffect(() => {
//     (async () => setParty(
//       await (await fetch(`/api/event/${eventId}/party/${partyId}`)).json() as Party
//     ))();
//   }, []);

//   const handleSortEnd = ({ oldIndex, newIndex }: SortEnd): void => {
//     if (party === 'loading') {
//       return;
//     }

//     const prefs = arrayMove(party.prefs, oldIndex, newIndex);
//     setParty({ ...party, prefs });
//   };

//   return (
//     <main className="container-sm">
//       { party === 'loading' ? (
//         <p>loading...</p>
//       ) : (
//         <>
//           <p>{ party.name='' }</p>
//           <PrefsList prefs={party.prefs} onSortEnd={handleSortEnd} />
//         </>
//       )}
//     </main>
//   );
// };

export default SortableElement<Props>(PrefPanel);
