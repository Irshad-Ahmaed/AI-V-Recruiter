import { Calendar, LayoutDashboard, List, Settings, WalletCards } from "lucide-react";

export const SidebarOptions = [
    {
        name:'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard'
    },
    {
        name:'Scheduled Interview',
        icon: Calendar,
        path: '/scheduled-interview'
    },
    {
        name:'All Interview',
        icon: List,
        path: '/all-interview'
    },
    {
        name:'Billing',
        icon: WalletCards,
        path: '/billings'
    },
    {
        name:'Settings',
        icon: Settings,
        path: '/settings'
    },
]