import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Media } from "@/types/movies";
import {
  AcademicCapIcon,
  Bars3BottomLeftIcon,
  BeakerIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  InformationCircleIcon,
  StarIcon,
  TvIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import type { FC } from "react";
import { fetchMediaAdditionalInfo } from "./action-media-additionnal-info";

export const MediaAdditionnalInfo: FC<{ media: Media }> = async ({ media }) => {
  const { synopsis, criticsConsensus, audienceConsensus, director, writer, genres, starring, releaseDate } = await fetchMediaAdditionalInfo(
    { mediaUrl: media.mediaUrl }
  );

  return (
    <>
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
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
