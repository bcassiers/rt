type MovieQuery = {
  title: string;
  grid: {
    id: string;
    list: Movie[];
  };
  pageInfo: { startCursor: string; endCursor: string; hasNextPage: Boolean; hasPreviousPage: Boolean };
};

type Movie = {
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
