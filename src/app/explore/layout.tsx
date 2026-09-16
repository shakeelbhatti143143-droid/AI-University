"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ExploreNavbar } from "@/components/explore/ExploreNavbar";
import { ExploreSidebar } from "@/components/explore/ExploreSidebar";
import { ExploreFooter } from "@/components/explore/ExploreFooter";
import { ExploreSearchModal } from "@/components/explore/ExploreSearchModal";
import { Menu, Search } from "lucide-react";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Main showcase pages require edge-to-edge full viewport experience
  const isShowcasePage = pathname === "/explore" || pathname === "/explore/campus";

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-[#0b1f3a] selection:text-white">
      {/* Top Fixed Explore Navbar */}
      <ExploreNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileSidebar={() => setIsMobileDrawerOpen(true)}
      />

      {isShowcasePage ? (
        /* Full Viewport Edge-to-Edge Experience for Explore University & Campus */
        <>
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>

          {/* Drawer navigation accessible anytime via Navbar "Directory" */}
          <ExploreSidebar
            isMobileDrawerOpen={isMobileDrawerOpen}
            onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            isCollapsed={false}
            hideStaticSidebar={true}
          />
        </>
      ) : (
        /* Structured Sub-Directory Layout with Sticky Sidebar */
        <div className="flex-1 w-full max-w-7xl mx-auto pt-20 sm:pt-24 px-3 sm:px-6 lg:px-8 flex flex-row gap-6 sm:gap-8 min-w-0">
          {/* Left Sidebar Navigation */}
          <ExploreSidebar
            isMobileDrawerOpen={isMobileDrawerOpen}
            onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            hideStaticSidebar={false}
          />

          {/* Central Content Area */}
          <main className="flex-1 min-w-0 pb-16">
            {/* Mobile Quick Utility Bar */}
            <div className="lg:hidden mb-4 flex items-center justify-between p-2.5 px-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-[#0b1f3a]"
              >
                <Menu className="w-4 h-4 text-[#0b1f3a]" />
                <span>Explore Portal Menu</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-[#0b1f3a] font-semibold hover:underline"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>

            {children}
          </main>
        </div>
      )}

      {/* Global Explore Search Modal */}
      <ExploreSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Global Explore Footer (Dark Navy visual conclusion) */}
      <ExploreFooter />
    </div>
  );
}
