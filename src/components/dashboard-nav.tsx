
'use client';

import {
  LayoutDashboard,
  LocateFixed,
  MapPin,
  Megaphone,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/placement-suggestions', icon: LocateFixed, label: 'Placement Suggestions' },
  { href: '/location-insights', icon: MapPin, label: 'Location Insights' },
  { href: '/offer-optimization', icon: Megaphone, label: 'Offer Optimization' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
