import { useQueryClient } from "react-query";
import './style.scss';

const App = () => {
  const queryClient = useQueryClient();
  const greet = queryClient.getQueryData<string>('greet');
  return (
    <div className="container-sm">
      <h1>FairMatch</h1>
      <form action="/startEvent" method="post" encType="multipart/form-data">
        <p>Upload an event definition file to start a new matching event.</p>
        <label>Definition file: <input type="file" id="defFile" name="defFile" /></label>
        <button type="submit">Start event</button>
      </form>
    </div>
  );
};

export default App;