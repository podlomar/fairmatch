import { SortableElement } from 'react-sortable-hoc';
import clsx from 'clsx';
import './style.scss';

interface Props {
  name: string;
  locked: boolean,
};


const PrefPanel = ({ name, locked }: Props): JSX.Element => {
  return (
    <div className={clsx(
      "pref-panel",
      { "pref-panel--locked": locked }
    )}>
      <div className="pref-panel__icon" />
      <div className="pref-panel__name">{name}</div>
    </div>
  );
}

export default SortableElement<Props>(PrefPanel);
