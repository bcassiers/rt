"use client";
import { ComponentPropsWithoutRef, FC, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { AcademicCapIcon, CalendarIcon, TvIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import {
  AUDIENCE_SCORE_OPTIONS,
  AffiliateOption,
  AffiliateOptions,
  AudienceScoreOption,
  CRITICS_SCORE_OPTIONS,
  CriticsScoreOption,
  FilterOptions,
  GENRE_OPTIONS,
  GenreOption,
  SORT_OPTIONS,
  SortOption,
} from "@/types/rotten-tomatoes";
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
import toPairs from "lodash/toPairs";

export const Movies: FC<ComponentPropsWithoutRef<"div">> = () => {
  const [genreFilter, setGenreFilter] = useState<GenreOption[]>([]);
  const [criticsFilter, setCriticsFilter] = useState<CriticsScoreOption[]>([]);
  const [affiliateFilter, setAffiliateFilter] = useState<AffiliateOption[]>([]);
  const [sorting, setSorting] = useState<SortOption | undefined>();
  const [audienceFilter, setAudienceFilter] = useState<AudienceScoreOption[]>([]);

  const movieQuery = useQuery(
    ["Movies", genreFilter, criticsFilter, sorting, affiliateFilter, audienceFilter],
    () =>
      axios.post<FilterOptions, AxiosResponse<MovieQuery>>("/api/movies", {
        genre: genreFilter,
        criticsScore: criticsFilter,
        audienceScore: audienceFilter,
        affiliate: affiliateFilter,
        sort: sorting,
      }),
    { onSuccess: (data) => console.log(data) }
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

  const movieData = movieQuery.data?.data;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
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
            {/* @ts-ignore */}
            <DropdownMenuRadioGroup value={sorting} onValueChange={setSorting}>
              {toPairs(SORT_OPTIONS).map(([key, value]) => (
                <DropdownMenuRadioItem value={key}>{value}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-x-6 gap-y-8 flex-wrap">
        {movieData?.grid.list.map((movie) => (
          <div className="bg-background flex flex-col gap-2 min-h-full ">
            <a
              target="_blank"
              rel="norefferer"
              href={`https://www.rottentomatoes.com${movie.mediaUrl}`}
              className="overflow-hidden rounded-md w-fit"
            >
              <Image
                src={movie.posterUri}
                alt={movie.title}
                width={206}
                height={305}
                className="object-cover transition-all hover:scale-105"
              />
            </a>
            <h2 className="font-medium text-md max-w-[200px] overflow-clip">{movie.title}</h2>
            <span className="flex gap-1 items-center text-xs text-muted-foreground mb-4">
              <CalendarIcon className="h-4 w-4" />
              {movie.releaseDateText}
            </span>
            <div className="grid grid-cols-2 divide-x divide-muted-foreground bg-muted px-2 py-3 rounded-md mt-auto">
              <span
                className={cn("flex gap-3 items-center text-sm text-red-600 font-semibold justify-center", {
                  "text-orange-600": Number(movie.criticsScore.score) >= 50,
                  "text-yellow-600": Number(movie.criticsScore.score) >= 60,
                  "text-cyan-600": Number(movie.criticsScore.score) >= 70,
                  "text-green-600": Number(movie.criticsScore.score) >= 90,
                })}
              >
                <AcademicCapIcon className="h-5 w-5" />
                <p>{movie.criticsScore.score}%</p>
              </span>
              <span
                className={cn("flex gap-3 items-center text-sm text-red-600 font-semibold justify-center", {
                  "text-orange-600": Number(movie.audienceScore.score) >= 50,
                  "text-yellow-600": Number(movie.audienceScore.score) >= 60,
                  "text-cyan-600": Number(movie.audienceScore.score) >= 70,
                  "text-green-600": Number(movie.audienceScore.score) >= 90,
                })}
              >
                <TvIcon className="h-5 w-5" />
                <p>{movie.audienceScore.score}%</p>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
