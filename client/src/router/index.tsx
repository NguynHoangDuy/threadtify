// router.jsx
import { createBrowserRouter } from 'react-router';
import { DashBoardPage } from '@/pages/DashBoardPage';
import { MainLayout } from '@/layouts/MainLayout';
import { PostPage } from '@/pages/PostPage';
import { CrawlJobDetail } from '@/pages/CrawlJobDetail';
import { paths } from './path';

export const router = createBrowserRouter([
     {
          path: '/',
          element: <MainLayout />,
          children: [
               { index: true, element: <DashBoardPage /> },
               { path: paths.posts, element: <PostPage /> },
               { path: paths.postDetail, element: <PostPage /> },
               { path: paths.crawlJobDetail, element: <CrawlJobDetail /> },
               { path: '*', element: <h1>404 - Not found</h1> },
          ],
     },
]);
