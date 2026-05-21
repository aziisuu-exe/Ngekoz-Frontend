"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,           
  SidebarGroupLabel,      
  SidebarGroupContent,    
} from "@/components/ui/sidebar"

import { 
  LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, 
  CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, 
  CommandIcon, 
  Users, MapPin, Box, CreditCard, Image as ImageIcon,
  UserCheck, Building, ShoppingCart, Receipt, Wallet,
  Heart, AlertTriangle, MessageSquare,
  Activity, Bell, Shield, ClipboardList
} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    { title: "Dashboard", url: "#", icon: <LayoutDashboardIcon /> },
    { title: "Lifecycle", url: "#", icon: <ListIcon /> },
    { title: "Analytics", url: "#", icon: <ChartBarIcon /> },
    { title: "Projects", url: "#", icon: <FolderIcon /> },
    { title: "Team", url: "#", icon: <UsersIcon /> },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: <Settings2Icon /> },
    { title: "Get Help", url: "#", icon: <CircleHelpIcon /> },
    { title: "Search", url: "#", icon: <SearchIcon /> },
  ],

  ngekozMenus: [
    {
      title: "Master Data",
      items: [
        { title: "User Management", url: "/admin/users", icon: Users },
        { title: "Location Data", url: "/admin/locations", icon: MapPin },
        { title: "Rules", url: "/admin/rules", icon: ClipboardList},
        { title: "Facility Management", url: "/admin/facilities", icon: Box },
        { title: "Banks", url: "/admin/banks", icon: CreditCard },
        { title: "Type of Photos", url: "/admin/photo-types", icon: ImageIcon },
      ],
    },
    {
      title: "Kos Management",
      items: [
        { title: "Owners", url: "/admin/owners", icon: UserCheck },
        { title: "List Properties", url: "/admin/list-properties", icon: Building },
      ],
    },
    {
      title: "Transactions",
      items: [
        { title: "Booking", url: "/admin/bookings", icon: ShoppingCart },
        { title: "Payment", url: "/admin/payments", icon: Receipt },
        { title: "User Banking Account", url: "/admin/bank-accounts", icon: Wallet },
      ],
    },
    {
      title: "User Interaction",
      items: [
        { title: "Wishlist", url: "/admin/wishlists", icon: Heart },
        { title: "Report", url: "/admin/reports", icon: AlertTriangle },
        { title: "Comment", url: "/admin/comments", icon: MessageSquare },
      ],
    },
    {
      title: "System Manage",
      items: [
        { title: "Log Activity", url: "/admin/logs", icon: Activity },
        { title: "Notifications", url: "/admin/notifications", icon: Bell },
        { title: "Role & Permission", url: "/admin/roles", icon: Shield },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.ngekozMenus.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        className="transition-colors duration-200 hover:bg-primary! hover:text-primary-foreground! data-[active=true]:bg-primary! data-[active=true]:text-primary-foreground!"
                      >
                        <a href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}