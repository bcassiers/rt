import type { FilterOptions, ResourceType } from "@/types/rotten-tomatoes";
import type { FC } from "react";
import { fetchMediaList } from "./action-media-list";

export const MediaList: FC<{ filters: FilterOptions; type: ResourceType }> = async ({ filters, type }) => {
  const { mediaList } = await fetchMediaList({
    filters,
    page: 1,
    type,
  });
  return <>{mediaList}</>;
};
