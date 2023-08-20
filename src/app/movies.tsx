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
  BeakerIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ComputerDesktopIcon,
  FilmIcon,
  InformationCircleIcon,
  StarIcon,
  TvIcon,
  VideoCameraIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type {
  AffiliateOption,
  AudienceScoreOption,
  CriticsScoreOption,
  FilterOptions,
  GenreOption,
  ResourceType,
  SortOption,
} from "@/types/rotten-tomatoes";
import { AUDIENCE_SCORE_OPTIONS, AFFILIATE_OPTIONS, CRITICS_SCORE_OPTIONS, GENRE_OPTIONS, SORT_OPTIONS } from "@/types/rotten-tomatoes";
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
import type { Media, MovieQuery, MediaQueryParameters } from "@/types/movies";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSearchParams } from "next/navigation";
import { isArray } from "lodash";

const initialFilters: FilterOptions = {
  genre: [],
  criticsScore: [],
  affiliate: [],
  audienceScore: [],
  rating: [],
  sort: [],
};

// this type is used to infer the type of the value in the handleFilterChange function
type FilterValueType<T extends keyof FilterOptions> = FilterOptions[T][number];

const useFilters = () => {
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

  return { filters, handleFilterChange, resetFilters };
};

export const Movies: FC<ComponentPropsWithoutRef<"div">> = () => {
  const { ref, inView } = useInView();
  const [criticsVsAudiencePreference, setCriticsVsAudiencePreference] = useState([1]);
  const [type, setType] = useState<ResourceType>("movies_at_home");
  const { filters, handleFilterChange, resetFilters } = useFilters();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
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
        <div className="flex gap-3 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn({ "border-blue-300": !!filters.genre.length })}>
                Genres
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select the desired genres</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toPairs(GENRE_OPTIONS).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  checked={filters.genre.includes(key as GenreOption)}
                  onCheckedChange={() => handleFilterChange("genre", key as GenreOption)}
                  key={key}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn({ "border-yellow-300": !!filters.criticsScore.length })}>
                Critics rating
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select the desired rating</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toPairs(CRITICS_SCORE_OPTIONS).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  checked={filters.criticsScore.includes(key as CriticsScoreOption)}
                  onCheckedChange={() => handleFilterChange("criticsScore", key as CriticsScoreOption)}
                  key={key}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn({ "border-orange-300": !!filters.audienceScore.length })}>
                Audience rating
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select the desired rating</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toPairs(AUDIENCE_SCORE_OPTIONS).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  checked={filters.audienceScore.includes(key as AudienceScoreOption)}
                  onCheckedChange={() => handleFilterChange("audienceScore", key as AudienceScoreOption)}
                  key={key}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn({ "border-purple-300": filters.affiliate.length })}>
                Platforms
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select the desired platforms</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toPairs(AFFILIATE_OPTIONS).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  checked={filters.affiliate.includes(key as AffiliateOption)}
                  onCheckedChange={() => handleFilterChange("affiliate", key as AffiliateOption)}
                  key={key}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn({ "border-cyan-300": filters.sort.length })}>
                sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select the desired sort</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filters.sort[0]} onValueChange={(value) => handleFilterChange("sort", value as SortOption)}>
                {toPairs(SORT_OPTIONS).map(([key, value]) => (
                  <DropdownMenuRadioItem value={key} key={key}>
                    {value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
        {filters.genre.length ||
        filters.criticsScore.length ||
        filters.audienceScore.length ||
        filters.affiliate.length ||
        filters.sort.length ? (
          <div className="text-sm flex gap-3 h-fit items-center flex-wrap">
            <p className="font-bold">Active filters :</p>
            {filters.genre.map((genre) => (
              <Badge key={genre} className="cursor-pointer bg-blue-300" onClick={() => handleFilterChange("genre", genre)}>
                {GENRE_OPTIONS[genre]}
              </Badge>
            ))}
            {filters.criticsScore.map((criticScoreOption) => (
              <Badge
                key={criticScoreOption}
                className="cursor-pointer bg-yellow-300"
                onClick={() => handleFilterChange("criticsScore", criticScoreOption)}
              >
                {CRITICS_SCORE_OPTIONS[criticScoreOption]}
              </Badge>
            ))}
            {filters.audienceScore.map((audienceScoreOption) => (
              <Badge
                key={audienceScoreOption}
                className="cursor-pointer bg-orange-300"
                onClick={() => handleFilterChange("audienceScore", audienceScoreOption)}
              >
                {AUDIENCE_SCORE_OPTIONS[audienceScoreOption]}
              </Badge>
            ))}
            {filters.affiliate.map((affiliateOption) => (
              <Badge
                key={affiliateOption}
                className="cursor-pointer bg-purple-300"
                onClick={() => handleFilterChange("affiliate", affiliateOption)}
              >
                {AFFILIATE_OPTIONS[affiliateOption]}
              </Badge>
            ))}
            {filters.sort.map((sortOption) => (
              <Badge key={sortOption} className="cursor-pointer bg-purple-300" onClick={() => handleFilterChange("sort", sortOption)}>
                {SORT_OPTIONS[sortOption]}
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="flex gap-2" onClick={() => resetFilters()}>
              <XCircleIcon className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-x-6 md:gap-y-8 py-10 flex-wrap">
        {mediaList
          ? mediaList.map((media, index) => (
              <MediaCard
                media={media}
                key={index}
                criticsVsAudiencePreference={criticsVsAudiencePreference}
                ref={index === mediaList.length - 1 ? ref : undefined}
              />
            ))
          : Array.from({ length: 20 }).map((_, index) => <MediaCardSkeleton key={index} />)}
      </div>
    </Tabs>
  );
};
type MediaCardProps = ComponentPropsWithoutRef<"div"> & { media: Media; criticsVsAudiencePreference: number[] };
const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(function MovieCard({ media, criticsVsAudiencePreference, ...props }, ref) {
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
const MediaCardSkeleton: FC<ComponentPropsWithoutRef<"div">> = ({ ...props }) => {
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
MediaCard.displayName = "MovieCard";
