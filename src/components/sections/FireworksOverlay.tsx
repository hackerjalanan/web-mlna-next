'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Fireworks } from 'fireworks-js';
const SHOW_DURATION = 5000;
export type FireworksOverlayHandle = {
  launch: () => void;
};
type FireworksOverlayProps = {
  onFinish?: () => void;
};
const FireworksOverlay = forwardRef<FireworksOverlayHandle, FireworksOverlayProps>(function FireworksOverlay({ onFinish }, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<Fireworks | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFinishRef = useRef(onFinish);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  /**
   * ---------------------------------------------------------
   * UPDATE CALLBACK
   * ---------------------------------------------------------
   */
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  /**
   * ---------------------------------------------------------
   * PORTAL
   * ---------------------------------------------------------
   */
  useEffect(() => {
    setPortalNode(document.body);
  }, []);

  /**
   * ---------------------------------------------------------
   * INIT FIREWORKS
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!portalNode) return;
    const container = containerRef.current;
    if (!container) return;
    const fireworks = new Fireworks(container, {
      autoresize: true,
      opacity: 1,
      // Gerakan
      acceleration: 1.02,
      friction: 0.98,
      gravity: 1.35,
      // Partikel
      particles: 90,
      // Trail
      traceLength: 7,
      traceSpeed: 8,
      // Ledakan
      explosion: 8,
      // Intensitas
      intensity: 35,
      // Efek
      flickering: 55,
      lineStyle: 'round',
      // Warna
      hue: {
        min: 0,
        max: 360,
      },
      // Delay internal
      delay: {
        min: 20,
        max: 40,
      },
      // Posisi rocket
      rocketsPoint: {
        min: 20,
        max: 80,
      },
      // Ketebalan
      lineWidth: {
        explosion: {
          min: 2,
          max: 4,
        },
        trace: {
          min: 1,
          max: 2,
        },
      },
      // Brightness
      brightness: {
        min: 85,
        max: 100,
      },
      // Decay
      decay: {
        min: 0.015,
        max: 0.03,
      },
      // Mouse dimatikan
      mouse: {
        click: false,
        move: false,
        max: 1,
      },
    });
    fireworksRef.current = fireworks;
    return () => {
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = null;
      }
      fireworks.stop();
      fireworks.clear();
      fireworksRef.current = null;
    };
  }, [portalNode]);

  const launch = useCallback(() => {
    const fireworks = fireworksRef.current;
    if (!fireworks) return;
    if (!fireworks.isRunning) {
      fireworks.start();
    }
    fireworks.launch(1);
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
    }

    finishTimeoutRef.current = setTimeout(() => {
      fireworks.waitStop().then(() => {
        fireworks.stop();
        finishTimeoutRef.current = null;
        onFinishRef.current?.();
      });
    }, SHOW_DURATION);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      launch,
    }),
    [launch],
  );

  if (!portalNode) {
    return null;
  }
  return createPortal(
    <div
      ref={containerRef}
      className="
        pointer-events-none
        fixed
        inset-0
        z-[99999]
        h-full
        w-full
        overflow-hidden
        bg-transparent
      "
      aria-hidden="true"
    />,
    portalNode,
  );
});
FireworksOverlay.displayName = 'FireworksOverlay';
export default FireworksOverlay;
