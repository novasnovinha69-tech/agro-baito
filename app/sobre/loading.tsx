import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <section className="bg-agro-gradient py-16">
        <div className="container-agro text-center">
          <Skeleton className="mx-auto mb-4 h-6 w-44 rounded-full bg-white/20" />
          <Skeleton className="mx-auto h-12 w-80 bg-white/20" />
          <Skeleton className="mx-auto mt-4 h-5 w-96 max-w-full bg-white/20" />
        </div>
      </section>
      <section className="container-agro py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 text-center">
              <Skeleton className="mx-auto h-14 w-14 rounded-full" />
              <Skeleton className="mx-auto mt-3 h-5 w-28" />
              <Skeleton className="mx-auto mt-2 h-3 w-40" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
