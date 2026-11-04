// router.jsx
import { createBrowserRouter } from 'react-router';
import { DashBoardPage } from '@/pages/DashBoardPage';
import { MainLayout } from '@/layouts/MainLayout';
import { PostPage } from '@/pages/PostPage';

export const router = createBrowserRouter([
     {
          path: '/',
          element: <MainLayout />,
          children: [
               { index: true, element: <DashBoardPage /> },
               { path: 'posts', element: <PostPage /> },
               { path: 'posts/:id', element: <PostPage /> },
               { path: '*', element: <h1>404 - Not found</h1> },
          ],
     },
]);
