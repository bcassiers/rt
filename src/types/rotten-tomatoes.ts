export const SORT_OPTIONS = {
  popular: "Popularity",
  newest: "Release date",
  a_z: "Title",
  audience_lowest: "Lowest audience score",
  audience_highest: "Highest audience score",
  critics_lowest: "Lowest critics score",
  critics_highest: "Highest critics score",
};

export type SortOption = keyof typeof SORT_OPTIONS;

export const GENRE_OPTIONS = {
  action: "Action",
  adventure: "Adventure",
  animation: "Animation",
  anime: "Anime",
  biography: "Biography",
  comedy: "Comedy",
  crime: "Crime",
  documentary: "Documentary",
  drama: "Drama",
  entertainment: "Entertainment",
  faith_and_spirituality: "Faith & Spirituality",
  fantasy: "Fantasy",
  game_show: "Game Show",
  lgbtq: "LGBTQ",
  health_and_wellness: "Health & Wellness",
  history: "History",
  holiday: "Holiday",
  horror: "Horror",
  house_and_garden: "House & Garden",
  kids_and_family: "Kids & Family",
  music: "Music",
  musical: "Musical",
  mystery_and_thriller: "Mystery & Thriller",
  nature: "Nature",
  news: "News",
  reality: "Reality",
  romance: "Romance",
  sci_fi: "Sci-Fi",
  short: "Short",
  soap: "Soap",
  special_interest: "Special Interest",
  sports: "Sports",
  stand_up: "Stand Up",
  talk_show: "Talk Show",
  travel: "Travel",
  variety: "Variety",
  war: "War",
  western: "Western",
};

export type GenreOption = keyof typeof GENRE_OPTIONS;

export const AUDIENCE_SCORE_OPTIONS = {
  upright: "Fresh (>60%)",
  spilled: "Rotten (<60%)",
};

export type AudienceScoreOption = keyof typeof AUDIENCE_SCORE_OPTIONS;

export const CRITICS_SCORE_OPTIONS = {
  certified_fresh: "Certified Fresh",
  fresh: "Fresh (>60%)",
  rotten: "Rotten (<60%)",
};
export type CriticsScoreOption = keyof typeof CRITICS_SCORE_OPTIONS;

export const RatingOptions = {
  g: "G",
  pg: "PG",
  pg_13: "PG-13",
  r: "R",
  nc_17: "NC-17",
  ur: "Unrated",
};

export type RatingOption = keyof typeof RatingOptions;

export const AFFILIATE_OPTIONS = {
  amazon_prime: "Amazon Prime",
  amc_plus: "AMC+",
  apple_tv_plus: "Apple TV+",
  apple_tv_us: "Apple TV",
  disney_plus: "Disney+",
  hulu: "Hulu",
  max_us: "HBO Max",
  netflix: "Netflix",
  paramount_plus: "Paramount+",
  peacock: "Peacock",
  showtime: "Showtime",
  vudu: "Vudu",
};

export type AffiliateOption = keyof typeof AFFILIATE_OPTIONS;

export type FilterOptions = {
  sort: SortOption[];
  genre: GenreOption[];
  audienceScore: AudienceScoreOption[];
  criticsScore: CriticsScoreOption[];
  rating: RatingOption[];
  affiliate: AffiliateOption[];
};

export const RESOURCE_TYPES = {
  movies_at_home: "Movies at home",
  movies_in_theaters: "Movies in theaters",
  movies_coming_soon: "Movies coming soon",
  tv_series_browse: "TV shows",
};

export type ResourceType = keyof typeof RESOURCE_TYPES;
