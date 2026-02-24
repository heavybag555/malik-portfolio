"use client";

export default function BackgroundPlaceholder() {
  const placeholderCount = 100;

  return (
    <main className="w-full min-h-screen p-[12px] pb-[48px] flex flex-col gap-[48px] bg-white">
      <div className="h-[12px]" />

      <section className="flex flex-col gap-0">
        <div className="h-[250px]" />
        <div className="h-[250px]" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[12px] md:gap-x-[48px] lg:gap-x-[96px] gap-y-[12px] md:gap-y-[48px] items-end">
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[8px]">
              <div
                className="w-full aspect-square bg-[#e5e5e5]"
                style={{ minHeight: 120 }}
              />
              <div className="h-[10px] w-3/4 bg-[#e5e5e5] rounded-sm" />
              <div className="h-[10px] w-1/2 bg-[#e5e5e5] rounded-sm" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
