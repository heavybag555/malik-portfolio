import Image from "next/image";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";

export default function Home() {
  const photosDir = path.join(process.cwd(), "public/ML-photos");

  // Fixed randomized order - do not change this array
  const photoOrder = [
    "Photo Nov 21 2025, 8 25 53 AM (1).jpg",
    "000060360002.jpg",
    "mali587-026.jpg",
    "img20210722_13372500.jpg",
    "000060350010.jpg",
    "neighbork82022AA005.jpg",
    "069B0084.jpg",
    "000002830010.jpg",
    "raw20221026_12421548 3.jpg",
    "000050880027.jpg",
    "MALI699-053.jpg",
    "Photo Dec 27 2024, 6 02 50 PM (9).jpg",
    "img20210723_19195076.jpg",
    "6G1A4184-2.jpg",
    "000095000004.jpg",
    "000060350003.jpg",
    "neighbork82022AA006.jpg",
    "Photo Nov 21 2025, 8 22 37 AM.jpg",
    "000002820005.jpg",
    "img20251110_18045890.jpg",
    "000065990011.jpg",
    "Photo Nov 21 2025, 8 25 53 AM (2).jpg",
    "000069560031.jpg",
    "Photo Dec 27 2024, 6 02 50 PM (7) (1).jpg",
    "000047390030.jpg",
    "000060350001.jpg",
    "000087180036.jpg",
    "Photo Jul 26 2025, 5 37 21 PM (1).jpg",
    "C32A5435.jpg",
    "000084160022.jpg",
    "IMG9434-R01-025A.jpg",
    "000047380010.jpg",
    "img20231009_09074829.jpg",
    "IMG3414-R01-002A.jpg",
    "000060350032.jpg",
    "000087180038.jpg",
    "Photo Mar 05 2024, 12 51 55 PM.jpg",
    "IMG3414-R01-020A.jpg",
    "000047390016.jpg",
    "img20210308_18205472_2006.jpg",
    "img20210723_18531122.jpg",
    "000011460023.jpg",
    "img20250730_03173069.jpg",
    "000065990027.jpg",
    "AA007A.jpg",
    "000047390026.jpg",
    "cine400dbtsAA032.jpg",
    "IMG9434-R01-026A.jpg",
    "000018560014.jpg",
    "raw20221216_00004245.jpg",
    "000060360015.jpg",
    "000018560026.jpg",
    "274A1716.jpg",
    "0F4A3254.jpg",
    "Photo Dec 24 2022, 4 43 06 PM.jpg",
    "IMG3415-R01-007A.jpg",
    "mali014-103.jpg",
    "000060350030.jpg",
    "000094990036.jpg",
    "000002840004.jpg",
    "IMG9434-R01-009A.jpg",
    "cine400dbtsAA033.jpg",
    "img20250730_02231568.jpg",
    "Photo Dec 27 2024, 6 02 50 PM.jpg",
    "Photo Dec 19 2024, 1 47 51 PM.jpg",
    "000047380025.jpg",
    "0F4A3402.jpg",
    "img20251110_18063404.jpg",
    "Photo Nov 21 2025, 8 20 48 AM.jpg",
    "IMG3414-R01-010A.jpg",
    "069B1206.jpg",
    "12AA003.jpg",
    "000069550002.jpg",
    "Laing0049.jpg",
    "C32A5470.jpg",
    "069B0081.jpg",
    "0F4A3103.jpg",
    "IMG9434-R01-011A.jpg",
    "raw20221026_12204259-2.jpg",
    "Photo Nov 21 2025, 8 25 53 AM.jpg",
    "000084160016.jpg",
    "IMG3414-R01-003A.jpg",
    "MALI699-049.jpg",
    "img20231009_09033075.jpg",
    "MALI699-021.jpg",
    "000047380023.jpg",
  ];

  const projects = photoOrder.map((file, i) => {
    const filePath = path.join(photosDir, file);
    const imageBuffer = fs.readFileSync(filePath);
    const dimensions = sizeOf(imageBuffer);
    return {
      id: i + 1,
      title: `Project ${i + 1}`,
      description: "Description",
      image: `/ML-photos/${encodeURIComponent(file)}`,
      width: dimensions.width,
      height: dimensions.height,
    };
  });

  return (
    <main className="w-full min-h-screen bg-white p-[12px] pb-[48px] flex flex-col gap-[48px]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-[4px] px-[12px] backdrop-blur-md">
        <div className="w-full flex items-start gap-[8px] text-[13px] font-medium leading-none tracking-[0.03em] text-[#0043e0]">
          <div className="flex-1">M.L.</div>
          <div className="flex-1 flex justify-between items-start">
            <nav className="flex gap-[12px]">
              <div>
                <a href="#overview" className="hover:opacity-60">
                  Overview
                </a>
              </div>
              <div>
                <a href="#index" className="hover:opacity-60">
                  Index
                </a>
              </div>
            </nav>
            <div>Info</div>
          </div>
        </div>
      </header>

      <section className="w-full flex flex-col gap-[4px]">
        <div className="h-[40vh] flex flex-col justify-end relative z-10">
          <div className="flex gap-[10px] items-end">
            {/* Malik Laing container - fills available width */}
            <div className="flex-1">
              <h1 className="font-bold italic text-[96px] leading-[60%] tracking-[-0.07em] text-black">
                <span
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: "1px #0043e0",
                    fontFamily: "Times New Roman, serif",
                  }}
                >
                  Malik Laing
                </span>
              </h1>
            </div>

            <div className="flex-1 flex justify-between items-start text-[13px] font-medium leading-none tracking-[0.03em]">
              <p className="max-w-[403px]">
                Photographer and director from San Bernardino, California.
              </p>
              <span>1998</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-6 gap-x-[12px] gap-y-[24px]">
          {projects.map((project, i) => (
            <div
              key={i}
              className="flex flex-col gap-[10px] group cursor-pointer"
            >
              <div className="w-full relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={project.width!}
                  height={project.height!}
                  className="w-full h-auto"
                  sizes="16vw"
                />
              </div>
              <div className="flex flex-col gap-[2px] text-[11px] font-medium leading-none tracking-[0.03em]">
                <span className="text-black">{project.title}</span>
                <span className="text-[#ACACAC]">{project.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
