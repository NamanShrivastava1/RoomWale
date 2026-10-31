import { useEffect } from "react";
import { gsap } from "gsap";
export function usePageMotion(key) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-enter",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "all",
        },
      );
      gsap.fromTo(
        ".reveal-card",
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.07,
          delay: 0.1,
          clearProps: "all",
        },
      );
    });
    return () => ctx.revert();
  }, [key]);
}
