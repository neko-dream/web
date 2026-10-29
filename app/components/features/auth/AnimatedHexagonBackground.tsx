import "./AnimatedHexagonBackground.css";

export function AnimatedHexagonBackground() {
  return (
    <div className="auth-hexagon-background" aria-hidden="true">
      <ul className="auth-hexagons">
        {Array.from({ length: 20 }, (_, index) => (
          <li key={`hexagon-${index}`} />
        ))}
      </ul>
    </div>
  );
}
