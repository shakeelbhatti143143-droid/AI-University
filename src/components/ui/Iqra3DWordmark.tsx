"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface Iqra3DWordmarkProps {
  className?: string;
}

export const Iqra3DWordmark: React.FC<Iqra3DWordmarkProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const systemReducedMotion = useReducedMotion();
  // Safe evaluation to guarantee 100% server/client initial HTML match
  const shouldReduceMotion = mounted && Boolean(systemReducedMotion);

  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Motion values for smooth 3D mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for natural physical weight and damping
  const springConfig = { stiffness: 180, damping: 22, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Tilt mappings: Controlled, subtle 3D rotational tilt
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [4.5, -4.5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5.5, 5.5]);
  const translateZ = useTransform(smoothMouseX, [-0.5, 0.5], [8, 14]);

  // Dynamic light sheen position mapped to cursor
  const sheenOffsetX = useTransform(smoothMouseX, [-0.5, 0.5], ["20%", "80%"]);
  const sheenOffsetY = useTransform(smoothMouseY, [-0.5, 0.5], ["20%", "80%"]);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      setCanHover(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Mark entrance animation complete to seamlessly transition into idle breathing
  useEffect(() => {
    if (shouldReduceMotion) {
      setHasEntered(true);
      return;
    }

    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Handle mouse movement relative to the logo container
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      if (!canHover || shouldReduceMotion || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalized coordinates: center is (0, 0), ranging from -0.5 to +0.5
      const normalizedX = clientX / rect.width - 0.5;
      const normalizedY = clientY / rect.height - 0.5;

      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    },
    [canHover, shouldReduceMotion, mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    if (canHover && !shouldReduceMotion) {
      setIsHovered(true);
    }
  }, [canHover, shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <span
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block cursor-default ${className}`}
      style={{
        perspective: "1200px",
        perspectiveOrigin: "center center",
      }}
    >
      {/* 3D Motion Container with cinematic entrance & smooth idle floating */}
      <motion.span
        initial={
          shouldReduceMotion
            ? { opacity: 1, scale: 1, z: 0, filter: "blur(0px)" }
            : {
                opacity: 0,
                scale: 0.91,
                z: -35,
                filter: "blur(8px)",
              }
        }
        animate={
          shouldReduceMotion
            ? { opacity: 1, scale: 1, z: 0, filter: "blur(0px)" }
            : hasEntered && !isHovered
            ? {
                opacity: 1,
                scale: 1,
                z: 0,
                filter: "blur(0px)",
                y: [-1.2, 1.2, -1.2],
                rotateX: [-0.5, 0.5, -0.5],
                rotateY: [-0.6, 0.6, -0.6],
                transition: {
                  y: {
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotateX: {
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotateY: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              }
            : {
                opacity: 1,
                scale: 1,
                z: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1.25,
                  ease: [0.16, 1, 0.3, 1],
                },
              }
        }
        style={{
          display: "inline-block",
          transformStyle: "preserve-3d",
          rotateX: isHovered && !shouldReduceMotion ? rotateX : 0,
          rotateY: isHovered && !shouldReduceMotion ? rotateY : 0,
          translateZ: isHovered && !shouldReduceMotion ? translateZ : 0,
        }}
        className="relative select-none"
      >
        {/* ========================================================================= */}
        {/* BASE 3D EXTRUSION & MATERIAL LAYER                                        */}
        {/* ========================================================================= */}
        <span
          className="relative inline-block font-heading font-black tracking-[0.06em] sm:tracking-[0.08em] uppercase transition-all duration-300"
          style={{
            // Metallic Deep Navy to Midnight Gradient
            background:
              "linear-gradient(135deg, #1e40af 0%, #1e3a8a 16%, #0f274a 42%, #0b1f3a 68%, #08162e 88%, #050e1d 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",

            // Precision Layered 3D Extrusion + Bevel Highlights + Deep Occlusion Shadows
            textShadow: `
              /* Top-left chamfer micro-specular highlight */
              -0.5px -0.5px 0.5px rgba(224, 242, 254, 0.45),
              0 -1px 0.5px rgba(219, 234, 254, 0.6),
              
              /* Stepped Deep Navy Dimensional Extrusion */
              0 1px 0 #1d3d6b,
              0 2px 0 #163359,
              0 3px 0 #122b4d,
              0 4px 0 #0e2340,
              0 5px 0 #0a1b33,
              0 6px 0 #071326,
              0 7px 0 #050d1a,
              0 8px 0 #030812,

              /* Ambient Occlusion & Soft Atmospheric Ground Shadows */
              0 10px 4px rgba(2, 6, 17, 0.85),
              0 18px 28px rgba(2, 6, 17, 0.7),
              0 32px 55px rgba(0, 0, 0, 0.6)
            `,
          }}
        >
          IQRA
        </span>

        {/* ========================================================================= */}
        {/* TRAVELING SPECULAR REFLECTION (METALLIC / GLOSS LIGHT SHEEN)               */}
        {/* ========================================================================= */}
        {!shouldReduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 font-heading font-black tracking-[0.06em] sm:tracking-[0.08em] uppercase pointer-events-none inline-block"
            initial={{
              backgroundPosition: "-150% 0",
            }}
            animate={{
              backgroundPosition: ["-150% 0", "250% 0"],
            }}
            transition={{
              duration: 1.3,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              repeatDelay: 7.5,
            }}
            style={{
              background:
                "linear-gradient(112deg, transparent 20%, rgba(219, 234, 254, 0.0) 38%, rgba(255, 255, 255, 0.75) 50%, rgba(191, 219, 254, 0.25) 58%, transparent 72%)",
              backgroundSize: "220% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              mixBlendMode: "overlay",
              transform: "translateZ(2px)",
            }}
          >
            IQRA
          </motion.span>
        )}

        {/* ========================================================================= */}
        {/* SUBTLE DYNAMIC CURSOR SPECULAR GLINT (DESKTOP INTERACTIVE HIGHLIGHT)      */}
        {/* ========================================================================= */}
        {canHover && isHovered && !shouldReduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 font-heading font-black tracking-[0.06em] sm:tracking-[0.08em] uppercase pointer-events-none transition-opacity duration-300 inline-block"
            style={{
              background: `radial-gradient(circle 90px at ${sheenOffsetX} ${sheenOffsetY}, rgba(255, 255, 255, 0.55) 0%, rgba(191, 219, 254, 0.2) 45%, transparent 70%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              mixBlendMode: "screen",
              transform: "translateZ(4px)",
            }}
          >
            IQRA
          </motion.span>
        )}
      </motion.span>
    </span>
  );
};
