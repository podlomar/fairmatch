import { hydrateRoot } from 'react-dom/client';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import App from '../common/App';

const dehydratedState = window.__REACT_QUERY_STATE__;

const queryClient = new QueryClient();

hydrateRoot(
  document.querySelector('#app')!, 
  <QueryClientProvider client={queryClient}>
    <Hydrate state={dehydratedState}>
      <App />
    </Hydrate>
   </QueryClientProvider>,
);
