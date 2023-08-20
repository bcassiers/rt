"use client";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { ComputerDesktopIcon, FilmIcon, TvIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import type { ResourceType } from "@/types/rotten-tomatoes";
import { useInView } from "react-intersection-observer";
import type { MovieQuery, MediaQueryParameters } from "@/types/movies";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaCard, MediaCardSkeleton } from "./media-card";
import { FILTER_DISPLAY_PROPS, useFilters } from "./filters";

export const Movies: FC<ComponentPropsWithoutRef<"div">> = () => {
  const { ref, inView } = useInView();
  const [criticsVsAudiencePreference, setCriticsVsAudiencePreference] = useState([1]);
  const [type, setType] = useState<ResourceType>("movies_at_home");
  const { filters, FilterDropdown, ActiveFilters } = useFilters();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ["Movies", filters, type],
    ({ pageParam }) =>
      axios.post<Error, AxiosResponse<MovieQuery>, MediaQueryParameters>("/api/movies/search", {
        filters,
        page: pageParam,
        type,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.data.nextPage,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const mediaList = data?.pages.reduce((acc, page) => [...acc, ...page.data.grid.list], [] as MovieQuery["grid"]["list"]);

  return (
    <Tabs className="flex flex-col px-3 md:px-10" value={type} onValueChange={(value) => setType(value as ResourceType)}>
      <div className="flex flex-col gap-3 sticky top-0 py-2 md:py-4 bg-background border-b border-foreground z-10">
        {/* NAVIGATION */}
        <TabsList className="flex w-fit">
          <TabsTrigger value="movies_at_home" className="flex gap-2">
            <TvIcon className="h-4 md:h-5" />
            <p className="hidden sm:block">Movies at home</p>
          </TabsTrigger>
          <TabsTrigger value="movies_in_theaters" className="flex gap-2">
            <VideoCameraIcon className="h-4 md:h-5" />
            <p className="hidden sm:block">Movies in theaters</p>
          </TabsTrigger>
          <TabsTrigger value="tv_series_browse" className="flex gap-2">
            <ComputerDesktopIcon className="h-4 md:h-5" />
            <p className="hidden sm:block">TV Shows</p>
          </TabsTrigger>
          <TabsTrigger value="movies_coming_soon" className="flex gap-2">
            <FilmIcon className="h-4 md:h-5" />
            <p className="hidden sm:block">Coming soon</p>
          </TabsTrigger>
        </TabsList>
        {/* FILTERS */}
        <div className="flex gap-3 flex-wrap">
          {FILTER_DISPLAY_PROPS.map((filterDisplayProps) => (
            <FilterDropdown key={filterDisplayProps.type} {...filterDisplayProps} />
          ))}
          <div className="ml-auto flex gap-3 w-[500px] items-center">
            Preference :<p>Critics</p>
            <Slider
              max={2}
              step={1}
              value={criticsVsAudiencePreference}
              onValueChange={setCriticsVsAudiencePreference}
              className="max-w-54 w-54 flex-grow"
            />
            <p>Audience</p>
          </div>
        </div>
        <ActiveFilters />
      </div>
      {/* MEDIA GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-x-6 md:gap-y-8 py-10 flex-wrap">
        {mediaList?.map((media, index) => (
          <MediaCard
            media={media}
            key={index}
            criticsVsAudiencePreference={criticsVsAudiencePreference}
            ref={index === mediaList.length - 1 ? ref : undefined}
          />
        ))}
        {isFetching ? Array.from({ length: 30 }).map((_, index) => <MediaCardSkeleton key={index} />) : null}
      </div>
    </Tabs>
  );
};
