import { useQueryClient } from "react-query";

const App = () => {
  const queryClient = useQueryClient();
  const greet = queryClient.getQueryData<string>('greet');
  return <h1>{greet} My app</h1>;
};

export default App;