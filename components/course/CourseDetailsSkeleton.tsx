/** Simple pulsing block used to compose the loading placeholder. */
function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-skeleton ${className}`} />;
}

/**
 * Loading placeholder that mirrors the real layout (content + sidebar), so the
 * page doesn't shift when data arrives.
 */
export default function CourseDetailsSkeleton() {
  return (
    <div className="md:grid md:grid-cols-[2fr_1fr] md:gap-gutter">
      {/* Main content */}
      <div>
        <Bar className="mb-4 h-10 w-3/5" />
        <Bar className="aspect-[16/9] w-full" />
        <div className="mt-6 flex gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Bar key={index} className="h-10 w-10 rounded-full" />
          ))}
        </div>
        <Bar className="mt-14 h-7 w-48" />
        <div className="shadow-soft mt-5 grid grid-cols-1 gap-4 rounded-sm px-9 py-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Bar key={index} className="h-6 w-4/5" />
          ))}
        </div>
        <Bar className="mt-14 h-7 w-40" />
        <div className="mt-5 space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-6">
              <Bar className="h-16 w-16 rounded-full sm:h-20 sm:w-20" />
              <div className="flex-1 space-y-3 py-2">
                <Bar className="h-4 w-2/5" />
                <Bar className="h-3 w-1/4" />
                <Bar className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="mt-14 md:mt-0">
        <Bar className="mb-10 h-7 w-3/5" />
        <Bar className="mb-14 h-[5px] w-full" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="mb-8 space-y-3">
            <Bar className="h-6 w-1/3" />
            <Bar className="h-4 w-4/5" />
            {Array.from({ length: 4 }).map((__, row) => (
              <Bar key={row} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
