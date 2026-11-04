import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { Provider } from 'react-redux';
import { store } from './store';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
     <Provider store={store}>
          <StrictMode>
               <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
               </QueryClientProvider>
          </StrictMode>
     </Provider>,
);
