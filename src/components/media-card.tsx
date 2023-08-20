"use client";
import type { Media } from "@/types/movies";
import {
  AcademicCapIcon,
  ArrowsUpDownIcon,
  Bars3BottomLeftIcon,
  BeakerIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  InformationCircleIcon,
  StarIcon,
  TvIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import axios from "axios";
import type { ComponentPropsWithoutRef, FC } from "react";
import { forwardRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import Image from "next/image";

type MediaCardProps = ComponentPropsWithoutRef<"div"> & { media: Media; criticsVsAudiencePreference: number[] };
export const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(function MovieCard(
  { media, criticsVsAudiencePreference, ...props },
  ref
) {
  const audienceScore = Number(media.audienceScore.score);
  const criticsScore = Number(media.criticsScore.score);
  const averageScore = (audienceScore * criticsVsAudiencePreference[0] + criticsScore * (2 - criticsVsAudiencePreference[0])) / 2;

  const additionalInfoQuery = useQuery(["Movie", media.mediaUrl], () =>
    axios.post<
      Error,
      AxiosResponse<{
        synopsis: string;
        audienceConsensus: string;
        criticsConsensus: string;
        director: string;
        writer: string;
        genres: string;
        starring: string;
        releaseDate: string;
      }>,
      { mediaUrl: string }
    >(`/api/movies/additionnal-info`, {
      mediaUrl: media.mediaUrl,
    })
  );

  const synopsis = additionalInfoQuery.data?.data.synopsis;
  const criticsConsensus = additionalInfoQuery.data?.data.criticsConsensus;
  const audienceConsensus = additionalInfoQuery.data?.data.audienceConsensus;
  const director = additionalInfoQuery.data?.data.director;
  const writer = additionalInfoQuery.data?.data.writer;
  const genres = additionalInfoQuery.data?.data.genres;
  const starring = additionalInfoQuery.data?.data.starring;
  const releaseDate = additionalInfoQuery.data?.data.releaseDate;
  const CardContent = () => (
    <>
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
          <h2 className="font-medium text-md max-w-[200px] overflow-clip">
            {`${media.criticsScore.certifiedAttribute ? "⭐️ " : ""}${media.title}`}
          </h2>
          <span className="flex gap-1 items-center text-xs text-muted-foreground">
            <CalendarIcon className="min-h-[1rem] min-w-[1rem] w-4 h-4" />
            {releaseDate ?? media.releaseDateText}
          </span>
          {director && (
            <span className="flex gap-1 items-center text-xs text-muted-foreground">
              <VideoCameraIcon className="min-h-[1rem] min-w-[1rem] w-4 h-4" />
              {director}
            </span>
          )}
          {writer && (
            <span className="flex gap-1 items-center text-xs text-muted-foreground">
              <ChatBubbleOvalLeftEllipsisIcon className="min-h-[1rem] min-w-[1rem] w-4 h-4" />
              {writer}
            </span>
          )}
          {genres && (
            <span className="flex gap-1 items-center text-xs text-muted-foreground">
              <BeakerIcon className="min-h-[1rem] min-w-[1rem] w-4 h-4" />
              {genres}
            </span>
          )}
          {starring && (
            <span className="flex gap-1 items-center text-xs text-muted-foreground">
              <StarIcon className="min-h-[1rem] min-w-[1rem] w-4 h-4" />
              {starring}
            </span>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <span className="flex gap-1 items-center text-xs text-muted-foreground underline cursor-pointer">
                <InformationCircleIcon className="h-4 w-4" />
                Additionnal info
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-80 overflow-scroll bg-muted  border">
              <div className="text-sm flex flex-col gap-5 flex-wrap">
                {additionalInfoQuery.isLoading ? (
                  <div className="flex gap-2 items-center">
                    <ArrowsUpDownIcon className="h-4 w-4" />
                    <p className="font-bold text-foreground">Loading...</p>
                  </div>
                ) : (
                  <>
                    {synopsis ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <Bars3BottomLeftIcon className="h-4 w-4" />
                          <span className="font-bold text-foreground">Synopsis</span>
                        </div>
                        <hr className="border-muted-foreground" />
                        <p className="text-muted-foreground">{synopsis}</p>
                      </div>
                    ) : null}
                    {criticsConsensus ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <AcademicCapIcon className="h-4 w-4" />
                          <span className="font-bold text-foreground">Critics Consensus</span>
                        </div>
                        <hr className="border-muted-foreground" />
                        <p className="text-muted-foreground">{criticsConsensus}</p>
                      </div>
                    ) : null}
                    {audienceConsensus ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <TvIcon className="h-4 w-4" />
                          <span className="font-bold text-foreground">Audience Consensus</span>
                        </div>
                        <hr className="border-muted-foreground" />
                        <p className="text-muted-foreground">{audienceConsensus}</p>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
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
    </>
  );
  if (!!ref)
    return (
      <div
        className={cn("flex flex-col gap-2 min-h-fit bg-muted rounded-xl", {
          "bg-red-900/50": averageScore,
          "bg-orange-900/50": averageScore >= 50,
          "bg-yellow-900/50": averageScore >= 60,
          "bg-cyan-900/50": averageScore >= 70,
          "bg-green-900/50": averageScore >= 90,
        })}
        ref={ref}
        {...props}
      >
        <CardContent />
      </div>
    );
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
      <CardContent />
    </div>
  );
});
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
