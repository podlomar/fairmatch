import { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react';
import { useNavigate } from 'react-router';
import yaml from 'yaml';
import type { MatchingEvent } from '../../../common/event';
import './style.scss';

const HomePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    console.log(e.target.files?.[0] ?? null);
  }
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file === null) {
      return;
    }
    
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = async (evt) => {
      const result = evt.target?.result as string;
      const eventDef = yaml.parse(result);
      const response = await fetch('/api/startEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDef),
      });
      const eventId = await response.json() as string;
      console.log(eventId);
      navigate(`/events/${eventId}`);
    };
  }

  return (
    <main className="container-sm">
      <form onSubmit={handleSubmit}>
        <p>Upload an event definition file to start a new matching event.</p>
        <label>
          Definition file:
          <input
            type="file"
            id="defFile"
            name="defFile"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Start event</button>
      </form>
    </main>
  );
};

export default HomePage;