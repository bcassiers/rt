"use client";

import { AFFILIATE_OPTIONS, AUDIENCE_SCORE_OPTIONS, CRITICS_SCORE_OPTIONS, GENRE_OPTIONS, SORT_OPTIONS } from "@/types/rotten-tomatoes";
import type {
  AffiliateOption,
  AudienceScoreOption,
  CriticsScoreOption,
  GenreOption,
  SortOption,
  FilterOptions,
} from "@/types/rotten-tomatoes";
import { isArray, toPairs } from "lodash";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { XCircleIcon } from "@heroicons/react/24/outline";

const initialFilters: FilterOptions = {
  genre: [],
  criticsScore: [],
  affiliate: [],
  audienceScore: [],
  rating: [],
  sort: [],
};

// this type is used to infer the type of the value in the handleFilterChange function
export type FilterValueType<T extends keyof FilterOptions> = FilterOptions[T][number];
export type FilterDisplayProps<T extends keyof FilterOptions> = {
  name: string;
  type: T;
  filterOptions: Record<FilterValueType<T>, string>;
};

export const FILTER_DISPLAY_PROPS = [
  {
    name: "genre",
    type: "genre",
    filterOptions: GENRE_OPTIONS,
  },
  {
    name: "critics rating",
    type: "criticsScore",
    filterOptions: CRITICS_SCORE_OPTIONS,
  },
  {
    name: "audience rating",
    type: "audienceScore",
    filterOptions: AUDIENCE_SCORE_OPTIONS,
  },
  {
    name: "plaform",
    type: "affiliate",
    filterOptions: AFFILIATE_OPTIONS,
  },
  {
    name: "sort",
    type: "sort",
    filterOptions: SORT_OPTIONS,
  },
] as FilterDisplayProps<keyof FilterOptions>[];
export const useFilters = () => {
  // const router = useRouter();
  // const pathname = usePathname();
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize filters from query params on component mount or route change
    const genre = searchParams.get("genre")?.split(",") ?? [];
    const criticsScore = searchParams.get("criticsScore")?.split(",") ?? [];
    const affiliate = searchParams.get("affiliate")?.split(",") ?? [];
    const audienceScore = searchParams.get("audienceScore")?.split(",") ?? [];
    const sort = searchParams.get("sort")?.split(",") ?? [];

    setFilters({
      genre: (genre ? (isArray(genre) ? genre : [genre]) : []) as GenreOption[],
      criticsScore: (criticsScore ? (isArray(criticsScore) ? criticsScore : [criticsScore]) : []) as CriticsScoreOption[],
      affiliate: (affiliate ? (isArray(affiliate) ? affiliate : [affiliate]) : []) as AffiliateOption[],
      audienceScore: (audienceScore ? (isArray(audienceScore) ? audienceScore : [audienceScore]) : []) as AudienceScoreOption[],
      sort: (sort ? (isArray(sort) ? sort : [sort]) : []) as SortOption[],
      rating: [],
    });
  }, [searchParams]);

  const handleFilterChange = <T extends keyof FilterOptions>(type: T, value: FilterValueType<T>) => {
    setFilters((prev) => {
      const currentFilter = prev[type] as unknown[];
      if (currentFilter.includes(value)) {
        return { ...prev, [type]: currentFilter.filter((item) => item !== value) };
      } else {
        return { ...prev, [type]: [...currentFilter, value] };
      }
    });
    // Update query params for array-based filters
    // searchParams.set(type, filters[type].join(","));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    // Reset query params
    // router.replace(pathname);
  };

  const areSomeFiltersActive = Object.values(filters).some((filter) => filter.length > 0);

  const Filter = <T extends keyof FilterOptions>({ name, type, filterOptions }: FilterDisplayProps<T>) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("capitalize", { "border-blue-300": !!filters[type].length })}>
            {name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select the desired {name}s</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {toPairs<string>(filterOptions).map(([key, value]) => (
            <DropdownMenuCheckboxItem
              checked={filters[type].includes(key as never)}
              onCheckedChange={() => handleFilterChange(type, key as FilterValueType<T>)}
              key={key}
            >
              {value}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const ActiveFilters = () => (
    <>
      {areSomeFiltersActive ? (
        <div className="text-sm flex gap-3 h-fit items-center flex-wrap">
          <p className="font-bold">Active filters :</p>
          {FILTER_DISPLAY_PROPS.map((filterDisplayProps) =>
            filters[filterDisplayProps.type].map((filter) => (
              <Badge
                key={filter}
                className={cn("cursor-pointer", {
                  "bg-blue-300": filterDisplayProps.type === "genre",
                  "bg-yellow-300": filterDisplayProps.type === "criticsScore",
                  "bg-orange-300": filterDisplayProps.type === "audienceScore",
                  "bg-purple-300": filterDisplayProps.type === "affiliate",
                  "bg-indigo-300": filterDisplayProps.type === "sort",
                })}
                onClick={() => handleFilterChange(filterDisplayProps.type, filter)}
              >
                {filterDisplayProps.filterOptions[filter]}
              </Badge>
            ))
          )}
          <Button variant="outline" size="sm" className="flex gap-2" onClick={() => resetFilters()}>
            <XCircleIcon className="h-4 w-4" />
            Clear all
          </Button>
        </div>
      ) : null}
    </>
  );

  return { filters, handleFilterChange, resetFilters, areSomeFiltersActive, FilterDropdown: Filter, ActiveFilters };
};
