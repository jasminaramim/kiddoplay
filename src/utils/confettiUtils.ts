import confetti from 'canvas-confetti';

export function fireVictoryConfetti() {
  if (typeof window === 'undefined') return;
  const colors = ['#0EA5E9', '#F43F5E', '#F59E0B', '#10B981', '#8B5CF6'];

  confetti({
    particleCount: 85,
    spread: 75,
    origin: { y: 0.6 },
    colors,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
  }, 180);
}

export function fireMiniConfetti() {
  if (typeof window === 'undefined') return;
  confetti({
    particleCount: 28,
    spread: 52,
    origin: { y: 0.7 },
    colors: ['#F59E0B', '#38BDF8', '#34D399', '#FB7185'],
  });
}

export const fireCelebrationConfetti = fireVictoryConfetti;
