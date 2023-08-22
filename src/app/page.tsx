import { LoadMoreMedia } from "@/components/load-more-media";
import { fetchMediaList } from "./action-media-list";
import { Filters } from "@/components/filters";
import type {
  GenreOption,
  CriticsScoreOption,
  AffiliateOption,
  AudienceScoreOption,
  SortOption,
  ResourceType,
} from "@/types/rotten-tomatoes";
import { isArray } from "lodash";

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { genre, criticsScore, affiliate, audienceScore, sort, type } = searchParams;
  const filters = {
    genre: (genre ? (isArray(genre) ? genre : [genre]) : []) as GenreOption[],
    criticsScore: (criticsScore ? (isArray(criticsScore) ? criticsScore : [criticsScore]) : []) as CriticsScoreOption[],
    affiliate: (affiliate ? (isArray(affiliate) ? affiliate : [affiliate]) : []) as AffiliateOption[],
    audienceScore: (audienceScore ? (isArray(audienceScore) ? audienceScore : [audienceScore]) : []) as AudienceScoreOption[],
    sort: (sort ? (isArray(sort) ? sort : [sort]) : []) as SortOption[],
    rating: [],
  };
  const resourceType = (type ? (isArray(type) ? type[0] : type) : "movies_at_home") as ResourceType;
  const { mediaList } = await fetchMediaList({
    filters,
    page: 1,
    type: resourceType,
  });

  return (
    <div className="bg-background">
      <Filters initialFilters={filters} type={resourceType} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-x-6 md:gap-y-8 py-10 flex-wrap px-3 md:px-10 ">
        {mediaList}
        <LoadMoreMedia />
      </div>
    </div>
  );
}
