import type { FilterOptions } from "./rotten-tomatoes";

export type MovieQuery = {
  title: string;
  grid: {
    id: string;
    list: Movie[];
  };
  pageInfo: { startCursor: string; endCursor: string; hasNextPage: boolean; hasPreviousPage: boolean };
  nextPage?: number;
};

export type MoviesQueryParameters = {
  filters: FilterOptions;
  page?: number;
};

export type Movie = {
  audienceScore: {
    score: string;
    sentiment: string;
  };
  criticsScore: {
    certifiedAttribute: string;
    score: string;
    sentiment: string;
  };
  emsId: string;
  isVideo: boolean;
  mediaUrl: string;
  mpxId?: string;
  publicId?: string;
  posterUri: string;
  releaseDateText: string;
  title: string;
  type: string;
};
