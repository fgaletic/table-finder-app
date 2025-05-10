
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
