import React from 'react'
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

import Link from 'next/link'

import { sidebar_items as items } from '@/constants/sidebar'

const SidebarItems = () => {
  return (
    <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Инструменты</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
  )
}

export default SidebarItems