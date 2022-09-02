import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import PartyPage from './pages/PartyPage';
import './style.scss';

const App = () => {
  return (
    <>
      <header className="container-sm">
        <div className="brand">
          <div className="brand__icon">

          </div>
          <h1 className="brand__name">FairMatch</h1>
        </div>
        
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="/parties/:partyId" element={<PartyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

createRoot(
  document.querySelector('#app') as Element
).render(<App />);
