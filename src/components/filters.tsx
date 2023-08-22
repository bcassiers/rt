"use client";
import { AFFILIATE_OPTIONS, AUDIENCE_SCORE_OPTIONS, CRITICS_SCORE_OPTIONS, GENRE_OPTIONS, SORT_OPTIONS } from "@/types/rotten-tomatoes";
import type { ResourceType } from "@/types/rotten-tomatoes";
import type { FilterOptions } from "@/types/rotten-tomatoes";
import { toPairs } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
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
import { ChevronDoubleRightIcon, FilmIcon, TvIcon, VideoCameraIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";

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

type TypeDisplayProps = {
  name: string;
  type: ResourceType;
  Icon: typeof TvIcon;
};

const TYPE_DISPLAY_PROPS: TypeDisplayProps[] = [
  {
    name: "movies at home",
    type: "movies_at_home",
    Icon: VideoCameraIcon,
  },
  {
    name: "movies in theaters",
    type: "movies_in_theaters",
    Icon: FilmIcon,
  },
  {
    name: "tv shows",
    type: "tv_series_browse",
    Icon: TvIcon,
  },
  {
    name: "coming soon",
    type: "movies_coming_soon",
    Icon: ChevronDoubleRightIcon,
  },
];

export const Filters: FC<{ initialFilters: FilterOptions; type: ResourceType }> = ({ initialFilters, type }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [criticsVsAudiencePreference, setCriticsVsAudiencePreference] = useState([1]);

  const setSearchParams = (newQuery: Record<string, string | string[]>) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(newQuery)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, item);
        }
      } else {
        params.append(key, value as string);
      }
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = <T extends keyof FilterOptions>(filterType: T, value: FilterValueType<T>) => {
    let newQuery;
    const currentFilter = initialFilters[filterType] as unknown[];
    if (currentFilter.includes(value)) {
      newQuery = { ...initialFilters, [filterType]: currentFilter.filter((item) => item !== value) };
    } else {
      newQuery = { ...initialFilters, [filterType]: [...currentFilter, value] };
    }
    setSearchParams({ ...newQuery, type });
  };

  const handleTypeChange = (value: ResourceType) => {
    setSearchParams({ ...initialFilters, type: value });
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  const areSomeFiltersActive = Object.values(initialFilters).some((filter) => filter.length > 0);

  const TypeMenu = () => (
    <Tabs className="flex flex-col" value={type} onValueChange={(value) => handleTypeChange(value as ResourceType)}>
      <TabsList className="flex w-fit">
        {TYPE_DISPLAY_PROPS.map(({ name, type, Icon }) => (
          <TabsTrigger key={type} value={type} className="flex gap-2">
            <Icon className="h-4 md:h-5" />
            <p className="hidden sm:block capitalize">{name}</p>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  const FilterDropdown = <T extends keyof FilterOptions>({ name, type, filterOptions }: FilterDisplayProps<T>) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("capitalize", { "border-blue-300": !!initialFilters[type].length })}>
            {name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select the desired {name}s</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {toPairs<string>(filterOptions).map(([key, value]) => (
            <DropdownMenuCheckboxItem
              checked={initialFilters[type].includes(key as never)}
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

  const FilterMenu = () => (
    <div className="flex gap-3 flex-wrap">
      {FILTER_DISPLAY_PROPS.map((filterDisplayProps) => (
        <FilterDropdown key={filterDisplayProps.type} {...filterDisplayProps} />
      ))}
    </div>
  );

  const PreferenceSlider = () => (
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
  );

  const ActiveFiltersList = () => (
    <>
      {areSomeFiltersActive ? (
        <div className="text-sm flex gap-3 h-fit items-center flex-wrap">
          <p className="font-bold">Active filters :</p>
          {FILTER_DISPLAY_PROPS.map((filterDisplayProps) =>
            initialFilters[filterDisplayProps.type].map((filter) => (
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

  return (
    <div className="flex flex-col gap-2 md:gap-6 sticky top-0 py-2 px-3 md:px-10 md:py-6 bg-background border-b border-foreground z-10">
      <TypeMenu />
      <div className="flex justify-between flex-wrap gap-2 md:gap-6">
        <FilterMenu />
        <PreferenceSlider />
      </div>
      <ActiveFiltersList />
    </div>
  );
};
