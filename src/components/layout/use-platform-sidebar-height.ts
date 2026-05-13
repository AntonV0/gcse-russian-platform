import { type RefObject, useEffect } from "react";

const FOOTER_STICKY_HANDOFF_MARGIN = 160;

export function usePlatformSidebarHeight(sidebarRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const sidebarElement = sidebar;
    const wrapperElement = sidebarElement.parentElement;

    let frameId = 0;
    let topOffset = 0;
    let fullHeight = 0;
    let lastHeight = -1;
    let isFooterVisible = false;

    function setSidebarHeight(nextHeight: number) {
      if (Math.abs(nextHeight - lastHeight) < 0.25) return;

      lastHeight = nextHeight;
      sidebarElement.style.setProperty(
        "--platform-sidebar-height",
        `${nextHeight.toFixed(2)}px`
      );
    }

    function setFooterMode(enabled: boolean) {
      if (!wrapperElement) return;

      if (!enabled) {
        wrapperElement.style.removeProperty("height");
        sidebarElement.style.removeProperty("position");
        sidebarElement.style.removeProperty("top");
        sidebarElement.style.removeProperty("left");
        sidebarElement.style.removeProperty("width");
        sidebarElement.style.removeProperty("z-index");
        return;
      }

      const wrapperRect = wrapperElement.getBoundingClientRect();

      wrapperElement.style.height = `${fullHeight.toFixed(2)}px`;
      sidebarElement.style.position = "fixed";
      sidebarElement.style.top = `${topOffset.toFixed(2)}px`;
      sidebarElement.style.left = `${wrapperRect.left.toFixed(2)}px`;
      sidebarElement.style.width = `${wrapperRect.width.toFixed(2)}px`;
      sidebarElement.style.zIndex = "60";
    }

    function measureViewport() {
      const stickyTop = wrapperElement
        ? Number.parseFloat(window.getComputedStyle(wrapperElement).top)
        : 0;
      const bottomPadding = 16;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

      topOffset = Number.isFinite(stickyTop) ? stickyTop : 0;
      fullHeight = Math.max(0, viewportHeight - topOffset - bottomPadding);
    }

    function updateSidebarHeight() {
      if (!isFooterVisible) {
        setFooterMode(false);
        setSidebarHeight(fullHeight);
        return;
      }

      setFooterMode(true);
      window.cancelAnimationFrame(frameId);

      frameId = window.requestAnimationFrame(() => {
        const bottomPadding = 16;
        const footer = document.querySelector<HTMLElement>("[data-site-footer]");
        const footerTop =
          footer?.getBoundingClientRect().top ?? topOffset + fullHeight + bottomPadding;
        const availableHeight = Math.max(0, footerTop - topOffset - bottomPadding);
        const nextHeight = Math.min(fullHeight, availableHeight);

        setSidebarHeight(nextHeight);
      });
    }

    measureViewport();
    setSidebarHeight(fullHeight);

    const footer = document.querySelector<HTMLElement>("[data-site-footer]");
    const footerObserver =
      footer && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              isFooterVisible = Boolean(entry?.isIntersecting);
              updateSidebarHeight();
            },
            { rootMargin: `0px 0px ${FOOTER_STICKY_HANDOFF_MARGIN}px 0px` }
          )
        : null;

    if (footerObserver && footer) {
      footerObserver.observe(footer);
    } else {
      isFooterVisible = true;
    }

    function handleScroll() {
      if (isFooterVisible) {
        updateSidebarHeight();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    function updateSidebarMeasurements() {
      measureViewport();
      updateSidebarHeight();
    }

    window.addEventListener("resize", updateSidebarMeasurements);
    window.visualViewport?.addEventListener("resize", updateSidebarMeasurements);

    return () => {
      window.cancelAnimationFrame(frameId);
      setFooterMode(false);
      footerObserver?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateSidebarMeasurements);
      window.visualViewport?.removeEventListener("resize", updateSidebarMeasurements);
    };
  }, [sidebarRef]);
}
