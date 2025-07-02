export default function BackgroundHueso() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage: "url(/xiro-hueso.webp)",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        opacity: 0.4,
      }}
    />
  );
}
