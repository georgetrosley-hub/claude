"use client";

import { useEffect, useRef, useState } from "react";
import { CienaDeck } from "@/components/sections/ciena/deck";
import { Sidebar, type SectionId } from "@/components/layout/sidebar";

const ORDERED_SECTIONS: ReadonlyArray<{ sectionId: SectionId; anchorId: string }> = [
  { sectionId: "cover", anchorId: "cover" },
  { sectionId: "whyCiena", anchorId: "why-ciena" },
  { sectionId: "whyNow", anchorId: "why-now" },
  { sectionId: "execution", anchorId: "execution" },
  { sectionId: "dollars", anchorId: "dollars" },
  { sectionId: "expansion", anchorId: "expansion" },
  { sectionId: "prioritization", anchorId: "prioritization" },
  { sectionId: "closing", anchorId: "closing" },
] as const;
const ACTIVATION_OFFSET_PX = 120;

function MainContent() {
  const [activeSection, setActiveSection] = useState<SectionId>("cover");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const activeSectionRef = useRef<SectionId>("cover");

  const handleSectionChange = (section: SectionId) => {
    setActiveSection(section);
    activeSectionRef.current = section;
    setMobileNavOpen(false);
    const targetId = ORDERED_SECTIONS.find((item) => item.sectionId === section)?.anchorId;
    const targetElement = targetId ? document.getElementById(targetId) : null;
    targetElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const scrollContainer = mainScrollRef.current;
    if (!scrollContainer) return;

    const sectionEntries = ORDERED_SECTIONS
      .map(({ sectionId, anchorId }) => {
        const element = document.getElementById(anchorId);
        return element ? { sectionId, element } : null;
      })
      .filter((entry): entry is { sectionId: SectionId; element: HTMLElement } => entry !== null);

    if (!sectionEntries.length) return;
    if (process.env.NODE_ENV === "development" && sectionEntries.length !== ORDERED_SECTIONS.length) {
      const found = new Set(sectionEntries.map((entry) => entry.sectionId));
      const missing = ORDERED_SECTIONS.filter((item) => !found.has(item.sectionId)).map(
        (item) => `${item.sectionId}#${item.anchorId}`
      );
      if (missing.length) {
        console.warn("Scrollspy missing sections:", missing.join(", "));
      }
    }

    const getSectionTops = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const baseScrollTop = scrollContainer.scrollTop;
      const tops = sectionEntries.map(({ sectionId, element }) => ({
        sectionId,
        top: baseScrollTop + (element.getBoundingClientRect().top - containerRect.top),
      }));
      return tops;
    };

    let frameRequested = false;
    const updateScrollState = () => {
      const scrollTop = scrollContainer.scrollTop;
      const maxScroll = Math.max(scrollContainer.scrollHeight - scrollContainer.clientHeight, 1);
      const nextProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      setScrollProgress((prev) => (Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev));

      const sectionTops = getSectionTops();
      const activationLine = scrollTop + ACTIVATION_OFFSET_PX;
      let nextActive = sectionTops[0]?.sectionId ?? activeSectionRef.current;
      for (const section of sectionTops) {
        if (section.top <= activationLine) {
          nextActive = section.sectionId;
        } else {
          break;
        }
      }
      if (scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2) {
        nextActive = sectionTops[sectionTops.length - 1]?.sectionId ?? nextActive;
      }
      if (nextActive !== activeSectionRef.current) {
        activeSectionRef.current = nextActive;
        setActiveSection(nextActive);
      }

      frameRequested = false;
    };
    const requestScrollStateUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(updateScrollState);
    };

    const onScroll = () => requestScrollStateUpdate();
    const onResize = () => requestScrollStateUpdate();

    updateScrollState();
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-surface pb-[env(safe-area-inset-bottom)] lg:flex lg:h-screen">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        scrollProgress={scrollProgress}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <main
          ref={mainScrollRef as unknown as React.RefObject<HTMLElement>}
          className="relative flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-16 xl:py-14"
        >
          <div className="mx-auto w-full max-w-6xl min-w-0">
            <div className="flex items-center justify-between gap-3 pb-6 sm:pb-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <img
                    src="/claude-ai-symbol.svg"
                    alt=""
                    className="h-4 w-4 opacity-70"
                    aria-hidden
                  />
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-faint">
                    Claude Enterprise
                  </p>
                </div>
                <p className="mt-1 truncate text-[13px] text-text-muted">Ciena account strategy</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="touch-target inline-flex min-h-[40px] items-center justify-center rounded-lg bg-white px-3 py-2 text-[12px] text-text-secondary shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#F5F4EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 lg:hidden"
              >
                Deck nav
              </button>
            </div>

            <CienaDeck />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return <MainContent />;
}
