import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-agro py-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <Skeleton className="mb-3 h-5 w-32" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
