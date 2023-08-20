"use client";
import type { ComponentPropsWithoutRef, FC } from "react";
import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import axios from "axios";
import {
  AcademicCapIcon,
  ArrowsUpDownIcon,
  Bars3BottomLeftIcon,
  CalendarIcon,
  InformationCircleIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { AffiliateOption, AudienceScoreOption, CriticsScoreOption, GenreOption, SortOption } from "@/types/rotten-tomatoes";
import { AUDIENCE_SCORE_OPTIONS, AffiliateOptions, CRITICS_SCORE_OPTIONS, GENRE_OPTIONS, SORT_OPTIONS } from "@/types/rotten-tomatoes";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import toPairs from "lodash/toPairs";
import type { Movie, MovieQuery, MoviesQueryParameters } from "@/types/movies";
import { Slider } from "@/components/ui/slider";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const Movies: FC<ComponentPropsWithoutRef<"div">> = () => {
  const [genreFilter, setGenreFilter] = useState<GenreOption[]>([]);
  const [criticsFilter, setCriticsFilter] = useState<CriticsScoreOption[]>([]);
  const [affiliateFilter, setAffiliateFilter] = useState<AffiliateOption[]>([]);
  const [sorting, setSorting] = useState<SortOption | undefined>();
  const [audienceFilter, setAudienceFilter] = useState<AudienceScoreOption[]>([]);
  const { ref, inView } = useInView();
  const [criticsVsAudiencePreference, setCriticsVsAudiencePreference] = useState([50]);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
    ["Movies", genreFilter, criticsFilter, sorting, affiliateFilter, audienceFilter],
    ({ pageParam }) =>
      axios.post<Error, AxiosResponse<MovieQuery>, MoviesQueryParameters>("/api/movies/search", {
        filters: {
          genre: genreFilter,
          criticsScore: criticsFilter,
          audienceScore: audienceFilter,
          affiliate: affiliateFilter,
          sort: sorting,
        },
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.data.nextPage,
    }
  );

  const handleGenreFiltersCheckedChange = (genre: GenreOption) => {
    if (genreFilter.includes(genre)) {
      setGenreFilter(genreFilter.filter((g) => g !== genre));
    } else {
      setGenreFilter([...genreFilter, genre]);
    }
  };

  const handleCriticsFiltersCheckedChange = (critics: CriticsScoreOption) => {
    if (criticsFilter.includes(critics)) {
      setCriticsFilter(criticsFilter.filter((c) => c !== critics));
    } else {
      setCriticsFilter([...criticsFilter, critics]);
    }
  };

  const handleAudienceFiltersCheckedChange = (audience: AudienceScoreOption) => {
    if (audienceFilter.includes(audience)) {
      setAudienceFilter(audienceFilter.filter((a) => a !== audience));
    } else {
      setAudienceFilter([...audienceFilter, audience]);
    }
  };

  const handleAffiliateFiltersCheckedChange = (affiliate: AffiliateOption) => {
    if (affiliateFilter.includes(affiliate)) {
      setAffiliateFilter(affiliateFilter.filter((a) => a !== affiliate));
    } else {
      setAffiliateFilter([...affiliateFilter, affiliate]);
    }
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const movieList = data?.pages.reduce((acc, page) => [...acc, ...page.data.grid.list], [] as MovieQuery["grid"]["list"]);
  return (
    <div className="flex flex-col px-10">
      <div className="flex gap-3 sticky top-0 py-4 bg-background border-b border-foreground z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={genreFilter.length ? "default" : "outline"}>Genres</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select the desired genres</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {toPairs(GENRE_OPTIONS).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                checked={genreFilter.includes(key as GenreOption)}
                onCheckedChange={() => handleGenreFiltersCheckedChange(key as GenreOption)}
                key={key}
              >
                {value}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={criticsFilter.length ? "default" : "outline"}>Critics rating</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select the desired rating</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {toPairs(CRITICS_SCORE_OPTIONS).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                checked={criticsFilter.includes(key as CriticsScoreOption)}
                onCheckedChange={() => handleCriticsFiltersCheckedChange(key as CriticsScoreOption)}
                key={key}
              >
                {value}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={audienceFilter.length ? "default" : "outline"}>Audience rating</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select the desired rating</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {toPairs(AUDIENCE_SCORE_OPTIONS).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                checked={audienceFilter.includes(key as AudienceScoreOption)}
                onCheckedChange={() => handleAudienceFiltersCheckedChange(key as AudienceScoreOption)}
                key={key}
              >
                {value}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={affiliateFilter.length ? "default" : "outline"}>Platforms</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select the desired platforms</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {toPairs(AffiliateOptions).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                checked={affiliateFilter.includes(key as AffiliateOption)}
                onCheckedChange={() => handleAffiliateFiltersCheckedChange(key as AffiliateOption)}
                key={key}
              >
                {value}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={sorting ? "default" : "outline"}>Sorting</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select the desired sorting</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sorting} onValueChange={(value) => setSorting(value as SortOption)}>
              {toPairs(SORT_OPTIONS).map(([key, value]) => (
                <DropdownMenuRadioItem value={key} key={key}>
                  {value}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto flex gap-3 w-[500px] items-center">
          <p>Critics Preference</p>
          <Slider
            max={100}
            step={1}
            value={criticsVsAudiencePreference}
            onValueChange={setCriticsVsAudiencePreference}
            className="max-w-54 w-54 flex-grow"
          />
          <p>Audience Preference</p>
        </div>
      </div>
      <div className="flex gap-x-6 gap-y-8 py-10 flex-wrap">
        {movieList?.map((movie, index) => (
          <MovieCard
            movie={movie}
            key={index}
            criticsVsAudiencePreference={criticsVsAudiencePreference}
            ref={index === movieList.length - 1 ? ref : undefined}
          />
        ))}
      </div>
    </div>
  );
};
type MovieCardProps = ComponentPropsWithoutRef<"div"> & { movie: Movie; criticsVsAudiencePreference: number[] };
const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(function MovieCard({ movie, criticsVsAudiencePreference, ...props }, ref) {
  const audienceScore = Number(movie.audienceScore.score);
  const criticsScore = Number(movie.criticsScore.score);
  const averageScore = (audienceScore * criticsVsAudiencePreference[0] + criticsScore * (100 - criticsVsAudiencePreference[0])) / 100;
  const [open, setIsOpen] = useState(false);

  const additionalInfoQuery = useQuery(
    ["Movie", movie.mediaUrl],
    () =>
      axios.post<Error, AxiosResponse<{ synopsis: string }>, { mediaUrl: string }>(`/api/movies/additionnal-info`, {
        mediaUrl: movie.mediaUrl,
      }),
    {
      enabled: open,
    }
  );

  const synopsis = additionalInfoQuery.data?.data.synopsis;

  const CardContent = () => (
    <>
      <a
        target="_blank"
        rel="norefferer"
        href={`https://www.rottentomatoes.com${movie.mediaUrl}`}
        className="overflow-hidden rounded-t-lg w-full h-[305px]"
      >
        <Image src={movie.posterUri} alt={movie.title} width={206} height={305} className="object-cover transition-all hover:scale-105" />
      </a>
      <div className="flex flex-col gap-2 py-1 flex-grow">
        <div className="flex flex-col gap-2 px-2 mb-4">
          <h2 className="font-medium text-md max-w-[200px] overflow-clip">{movie.title}</h2>
          <span className="flex gap-1 items-center text-xs text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {movie.releaseDateText}
          </span>
          <HoverCard onOpenChange={setIsOpen}>
            <HoverCardTrigger asChild>
              <span className="flex gap-1 items-center text-xs text-muted-foreground underline cursor-help">
                <InformationCircleIcon className="h-4 w-4" />
                Additionnal info
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-96 max-h-80 overflow-scroll bg-muted  border">
              <div className="text-sm flex flex-col gap-2 flex-wrap">
                {additionalInfoQuery.isLoading ? (
                  <div className="flex gap-2 items-center">
                    <ArrowsUpDownIcon className="h-4 w-4" />
                    <p className="font-bold text-foreground">Loading...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 items-center">
                      <Bars3BottomLeftIcon className="h-4 w-4" />
                      <span className="font-bold text-foreground">Synopsis</span>
                    </div>
                    <hr className="border-muted-foreground" />
                    <p className="text-muted-foreground">{synopsis ?? "No synopsis found."}</p>
                  </>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="grid grid-cols-2 divide-x divide-muted-foreground bg-muted px-2 py-3 rounded-md mt-auto mx-1">
          <span
            className={cn("flex gap-3 items-center text-sm text-foreground font-semibold justify-center", {
              "text-red-600": criticsScore,
              "text-orange-600": criticsScore >= 50,
              "text-yellow-600": criticsScore >= 60,
              "text-cyan-600": criticsScore >= 70,
              "text-green-600": criticsScore >= 90,
            })}
          >
            <AcademicCapIcon className="h-5 w-5" />
            <p>{movie.criticsScore.score}%</p>
          </span>
          <span
            className={cn("flex gap-3 items-center text-sm text-foreground font-semibold justify-center", {
              "text-red-600": audienceScore,
              "text-orange-600": audienceScore >= 50,
              "text-yellow-600": audienceScore >= 60,
              "text-cyan-600": audienceScore >= 70,
              "text-green-600": audienceScore >= 90,
            })}
          >
            <TvIcon className="h-5 w-5" />
            <p>{movie.audienceScore.score}%</p>
          </span>
        </div>
      </div>
    </>
  );
  if (!!ref)
    return (
      <div
        className={cn("flex flex-col gap-2 min-h-fit max-w-[206px] bg-background rounded-lg", {
          "bg-red-900/50": averageScore,
          "bg-orange-900/50": averageScore >= 50,
          "bg-yellow-900/50": averageScore >= 60,
          "bg-cyan-900/50": averageScore >= 70,
          "bg-green-900/50": averageScore >= 90,
          "border-2 border-yellow-300": movie.criticsScore.certifiedAttribute,
        })}
        ref={ref}
        {...props}
      >
        <CardContent />
      </div>
    );
  return (
    <div
      className={cn("flex flex-col gap-2 min-h-fit max-w-[206px] bg-background rounded-lg", {
        "bg-red-900/50": averageScore,
        "bg-orange-900/50": averageScore >= 50,
        "bg-yellow-900/50": averageScore >= 60,
        "bg-cyan-900/50": averageScore >= 70,
        "bg-green-900/50": averageScore >= 90,
        "border-2 border-yellow-300": movie.criticsScore.certifiedAttribute,
      })}
      {...props}
    >
      <CardContent />
    </div>
  );
});
MovieCard.displayName = "MovieCard";
