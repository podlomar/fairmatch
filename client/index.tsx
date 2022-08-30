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
        <h1>FairMatch</h1>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="/events/:eventId/party/:partyId" element={<PartyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

createRoot(
  document.querySelector('#app') as Element
).render(<App />);
