"use client";
import { fetchMediaList } from "@/app/action-media-list";
import { MediaCardSkeleton } from "@/app/media-card";
import { AcademicCapIcon, TvIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const LoadMoreMedia = () => {
  const [data, setData] = useState<{
    hasNextPage: boolean;
    media: ReactNode[];
    nextPage: number;
  }>({
    hasNextPage: true,
    media: [],
    nextPage: 2,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && data.hasNextPage) {
      fetchMediaList({
        filters: { affiliate: [], audienceScore: [], criticsScore: [], genre: [], rating: [], sort: [] },
        page: data.nextPage,
        type: "movies_at_home",
      }).then((response) => {
        setData({
          media: [...data.media, ...response.mediaList],
          hasNextPage: !!response.nextPage,
          nextPage: response.nextPage ?? data.nextPage,
        });
      });
    }
    // FIXME
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      {data.media}
      {data.hasNextPage ? (
        <>
          <div ref={ref} className="flex flex-col gap-2 min-h-fit bg-cyan-900/50 rounded-xl">
            <div className="overflow-hidden relative rounded-t-xl w-full bg-background animate-pulse aspect-[2/3]" />
            <div className="flex flex-col gap-2 py-1 flex-grow">
              <div className="flex flex-col gap-2 px-2 mb-4">
                <div className="bg-foreground/50 animate-pulse w-36 rounded-sm h-6 mb-6" />
                <div className="bg-muted-foreground/50 animate-pulse w-24 rounded-sm h-3" />
                <div className="bg-muted-foreground/50 animate-pulse w-36 rounded-sm h-3" />
              </div>
              <div className="grid grid-cols-2 divide-x divide-muted-foreground bg-background animate-pulse px-2 py-3 rounded-lg mt-auto mx-1.5 mb-0.5">
                <span className="flex gap-3 items-center text-sm text-foreground font-semibold justify-center">
                  <AcademicCapIcon className="h-5 w-5" />
                  <p>-- %</p>
                </span>
                <span className="flex gap-3 items-center text-sm text-foreground font-semibold justify-center">
                  <TvIcon className="h-5 w-5" />
                  <p>-- %</p>
                </span>
              </div>
            </div>
          </div>
          {Array.from({ length: 29 }).map((_, index) => (
            <MediaCardSkeleton key={index} />
          ))}
        </>
      ) : null}
    </>
  );
};
