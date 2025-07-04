import React from "react";

export default function ConfettiBurst({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Confeti */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-4 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80 + 10}%`,
            background: [
              "#fbbf24", // amarillo
              "#ef4444", // rojo
              "#3b82f6", // azul
              "#22d3ee", // celeste
              "#16a34a", // verde
              "#f472b6", // rosa
            ][i % 6],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall 1s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      {/* Destello central */}
      <div className="absolute w-40 h-40 rounded-full bg-yellow-300/60 blur-2xl animate-ping"></div>
    </div>
  );
}

// Animación CSS
// Agrega esto en tu index.css o tailwind.css global:
 /*
@keyframes confetti-fall {
  to {
    transform: translateY(400px) rotate(360deg);
    opacity: 0;
  }
}
*/