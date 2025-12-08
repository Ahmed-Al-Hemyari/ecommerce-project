import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../UI/sidebar";
import { Link, useLocation } from "react-router-dom";

const AppSidebar = ({ items }) => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>

        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold">
            QuickBuy Dashboard
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-15 space-y-5">
            {items.map((item) => {
              const isActive = location.pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-xl text-(--color-dark-gray)
                      ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"}`}
                  >
                    <Link to={item.url}>
                      <item.icon size={25} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;