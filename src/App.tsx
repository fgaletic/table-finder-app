
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamingTableDetail from "./pages/GamingTableDetail";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import React from "react";
import { MapTokenProvider } from "./components/MapTokenProvider";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MapTokenProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="gamingTable/:id" element={<GamingTableDetail />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </MapTokenProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
