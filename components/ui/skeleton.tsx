import { cn } from "@/lib/utils";

/**
 * Skeleton — placeholder com brilho (shimmer) para estados de carregamento.
 *
 * Motion principles (kylezantos/design-motion-principles):
 *  - Lens Jakub Krehel: shimmer sutil, nao pulsante (evita AI-slop).
 *  - `prefers-reduced-motion`: o gradiente para de deslizar (ver globals.css).
 *  - Nao anima de scale(0): aparece em opacidade natural.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-md bg-muted/70", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
