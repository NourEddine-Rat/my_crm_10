import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutDashboard, UserPlus, Search,MessageCircle,Atom } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Nouveaux leads',
        url: '/dashboard',
        icon: UserPlus,
    },
    {
        title: 'En qualification',
        url: '/dashboard',
        icon: Search,
    },
    {
        title: 'Messages',
        url: '/dashboard',
        icon: MessageCircle,
    },
    
];

const footerNavItems: NavItem[] = [
    {
        title: "projet informations",
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Atom,
    },
    
];

export function AppSidebar(props) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
