import { Link, useLocation } from 'react-router';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { paths } from '@/router/path';
import { LayoutDashboard, ReceiptPoundSterling } from 'lucide-react';
import logo from '@/assets/logo.png';

export function AppSidebar() {
     const { pathname } = useLocation();

     return (
          <Sidebar collapsible='icon'>
               <SidebarHeader>
                    <img src={logo} alt='Logo' width={32} height={32} className='rounded-xl' />
               </SidebarHeader>

               <SidebarContent>
                    <SidebarGroup>
                         <SidebarMenu>
                              <SidebarMenuItem className='mt-2'>
                                   <SidebarMenuButton render={<Link to={paths.dashboard} />} isActive={pathname === paths.dashboard} tooltip='Dashboard'>
                                        <LayoutDashboard className='mr-2 h-4 w-4' />
                                   </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem className='mt-2'>
                                   <SidebarMenuButton render={<Link to={paths.posts} />} isActive={pathname === paths.posts} tooltip='Posts'>
                                        <ReceiptPoundSterling className='mr-2 h-4 w-4' />
                                   </SidebarMenuButton>
                              </SidebarMenuItem>
                         </SidebarMenu>
                    </SidebarGroup>
               </SidebarContent>
          </Sidebar>
     );
}
