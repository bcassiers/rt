import type { Media } from "@/types/movies";
import { AcademicCapIcon, CalendarIcon, TvIcon } from "@heroicons/react/24/outline";
import { Suspense, type ComponentPropsWithoutRef, type FC } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MediaAdditionnalInfo } from "./media-card-additional-info";

export type MediaCardProps = ComponentPropsWithoutRef<"div"> & { media: Media; criticsVsAudiencePreference: number[] };
export const MediaCard: FC<MediaCardProps> = ({ media, criticsVsAudiencePreference, ...props }) => {
  const audienceScore = Number(media.audienceScore.score);
  const criticsScore = Number(media.criticsScore.score);
  const averageScore = (audienceScore * criticsVsAudiencePreference[0] + criticsScore * (2 - criticsVsAudiencePreference[0])) / 2;

  return (
    <div
      className={cn("flex flex-col gap-2 min-h-fit bg-muted rounded-xl", {
        "bg-red-900/50": averageScore,
        "bg-orange-900/50": averageScore >= 50,
        "bg-yellow-900/50": averageScore >= 60,
        "bg-cyan-900/50": averageScore >= 70,
        "bg-green-900/50": averageScore >= 90,
      })}
      {...props}
    >
      <a
        target="_blank"
        rel="norefferer"
        href={`https://www.rottentomatoes.com${media.mediaUrl}`}
        className="overflow-hidden relative rounded-t-xl w-full aspect-[2/3]"
      >
        <Image src={media.posterUri} alt={media.title} fill className="object-cover transition-all hover:scale-105" />
      </a>
      <div className="flex flex-col gap-2 py-1 flex-grow">
        <div className="flex flex-col gap-2 px-2 mb-4">
          <Suspense
            fallback={
              <>
                <h2 className="font-medium text-md max-w-[200px] overflow-clip">
                  {`${media.criticsScore.certifiedAttribute ? "⭐️ " : ""}${media.title}`}
                </h2>
                <span className="flex gap-1 items-center text-xs text-muted-foreground">
                  <CalendarIcon className="min-h-[1rem] min-w-[1rem] w-4 h-4" />
                  {media.releaseDateText}
                </span>
                <div className="bg-muted-foreground/50 animate-pulse w-24 rounded-sm h-3" />
                <div className="bg-muted-foreground/50 animate-pulse w-36 rounded-sm h-3" />
                <div className="bg-muted-foreground/50 animate-pulse w-20 rounded-sm h-3" />
                <div className="bg-muted-foreground/50 animate-pulse w-32 rounded-sm h-3" />
              </>
            }
          >
            <MediaAdditionnalInfo media={media} />
          </Suspense>
        </div>
        <div className="grid grid-cols-2 divide-x divide-muted-foreground bg-background px-2 py-3 rounded-lg mt-auto mx-1.5 mb-0.5">
          <span
            className={cn("flex gap-2 md:gap-3 items-center text-xs md:text-sm text-foreground font-semibold justify-center", {
              "text-red-500": criticsScore,
              "text-orange-500": criticsScore >= 50,
              "text-yellow-500": criticsScore >= 60,
              "text-cyan-500": criticsScore >= 70,
              "text-green-500": criticsScore >= 90,
            })}
          >
            <AcademicCapIcon className="h-3 md:h-5 w-3 md:w-5" />
            <p>{media.criticsScore.score ?? "-- "}%</p>
          </span>
          <span
            className={cn("flex gap-3 items-center text-xs md:text-sm text-foreground font-semibold justify-center", {
              "text-red-500": audienceScore,
              "text-orange-500": audienceScore >= 50,
              "text-yellow-500": audienceScore >= 60,
              "text-cyan-500": audienceScore >= 70,
              "text-green-500": audienceScore >= 90,
            })}
          >
            <TvIcon className="h-3 md:h-5 w-3 md:w-5" />
            <p>{media.audienceScore.score ?? "-- "}%</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export const MediaCardSkeleton: FC<ComponentPropsWithoutRef<"div">> = ({ ...props }) => {
  return (
    <div className="flex flex-col gap-2 min-h-fit bg-cyan-900/50 rounded-xl" {...props}>
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
  );
};
