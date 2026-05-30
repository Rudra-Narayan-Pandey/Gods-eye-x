/**
 * GOD'S EYE X — Particles Background Component
 * Interactive tsParticles background with cyan glow
 */

import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

let initialized = false;

/**
 * Initialize particles background in a container.
 * @param {HTMLElement} container - DOM element to render particles into
 * @returns {Function} cleanup function to destroy the particles instance
 */
export async function initParticles(container) {
  const containerId = 'gex-particles-' + Math.random().toString(36).slice(2, 8);
  container.id = containerId;

  // Load the slim preset once
  if (!initialized) {
    await loadSlim(tsParticles);
    initialized = true;
  }

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1200;

  const particleCount = isMobile ? 30 : isTablet ? 50 : 70;

  const instance = await tsParticles.load({
    id: containerId,
    options: {
      fullScreen: { enable: false },
      background: {
        color: { value: 'transparent' },
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: particleCount,
          density: {
            enable: true,
            area: 900,
          },
        },
        color: {
          value: ['#00f0ff', '#a855f7', '#6366f1'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.15, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.6,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 1.5,
            minimumValue: 0.5,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 0.8 },
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
          attract: {
            enable: false,
          },
        },
        links: {
          enable: true,
          color: '#00f0ff',
          opacity: 0.08,
          distance: 150,
          width: 1,
          triangles: {
            enable: false,
          },
        },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: !isMobile,
            mode: 'grab',
          },
          onClick: {
            enable: !isMobile,
            mode: 'push',
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 0.25,
              color: '#00f0ff',
            },
          },
          push: {
            quantity: 3,
          },
        },
      },
      detectRetina: true,
      smooth: true,
    },
  });

  // Return cleanup function
  return function cleanup() {
    if (instance) {
      instance.destroy();
    }
  };
}
