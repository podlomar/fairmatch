import { hydrateRoot } from 'react-dom/client';
import App from '../common/App';

hydrateRoot(document.querySelector('#app')!, <App />);
