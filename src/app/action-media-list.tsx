"use server";
import type { Media, MediaQueryParameters, MovieQuery } from "@/types/movies";
import { MediaCard, MediaCardSkeleton } from "./media-card";
import { Suspense, type ReactNode } from "react";

export const fetchMediaList: (props: MediaQueryParameters) => Promise<MovieQuery & { mediaList: ReactNode[] }> = async ({
  filters,
  page = 1,
  type = "movies_at_home",
}) => {
  const filterElements = [];
  if (filters.affiliate && filters.affiliate.length > 0) filterElements.push(`affiliates:${filters.affiliate.join(",")}`);
  if (filters.genre && filters.genre.length > 0) filterElements.push(`genres:${filters.genre.join(",")}`);
  if (filters.sort) filterElements.push(`sort:${filters.sort.join(",")}`);
  if (filters.criticsScore && filters.criticsScore.length > 0) filterElements.push(`critics:${filters.criticsScore.join(",")}`);
  if (filters.audienceScore && filters.audienceScore.length > 0) filterElements.push(`audience:${filters.audienceScore.join(",")}`);

  const filterQuery = filterElements.join("~");

  const response = await fetch(`https://www.rottentomatoes.com/napi/browse/${type ?? "movies_at_home"}/${filterQuery}?after=${page ?? 1}`, {
    next: { revalidate: 3600 * 3 },
  }).then((res) => res.json());
  const nextPage = response.pageInfo.endCursor;
  return {
    ...response,
    nextPage,
    mediaList: response.grid.list.map((media: Media) => (
      <Suspense fallback={<MediaCardSkeleton />} key={media.publicId}>
        <MediaCard media={media} criticsVsAudiencePreference={[1]} />
      </Suspense>
    )),
  };
};
