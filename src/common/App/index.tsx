import { useQueryClient } from "react-query";
import './style.scss';

const App = () => {
  const queryClient = useQueryClient();
  const greet = queryClient.getQueryData<string>('greet');
  return (
    <div className="layout">
      <div className="layout__left">
        <h1>FairMatch</h1>
      </div>
      <div className="layout__right">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni optio rem sint autem aperiam nemo. Possimus, quaerat! Culpa, necessitatibus architecto!</p>
      </div>
    </div>
  );
};

export default App;