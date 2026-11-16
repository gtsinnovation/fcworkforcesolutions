export default function FreshTag({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent ${className}`}
    >
      today
    </span>
  );
}