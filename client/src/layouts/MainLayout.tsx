import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';
import { AppSidebar } from './AppSideBar';

export const MainLayout = () => {
     return (
          <SidebarProvider defaultOpen={false}>
               <AppSidebar />
               <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6'>
                    <Outlet />
               </main>
          </SidebarProvider>
     );
};
