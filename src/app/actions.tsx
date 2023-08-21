"use server";
import type { MediaAdditionnalInfo, MediaQueryParameters, MovieQuery } from "@/types/movies";
import * as cheerio from "cheerio";

export const fetchMediaInfo: (props: MediaQueryParameters) => Promise<MovieQuery> = async ({
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

  const response = await fetch(
    `https://www.rottentomatoes.com/napi/browse/${type ?? "movies_at_home"}/${filterQuery}?after=${page ?? 1}`
  ).then((res) => res.json());
  const nextPage = response.pageInfo.endCursor;
  return { ...response, nextPage };
};

export const fetchMediaAdditionalInfo: (props: { mediaUrl: string }) => Promise<MediaAdditionnalInfo> = async ({ mediaUrl }) => {
  const response = await fetch(`https://www.rottentomatoes.com${mediaUrl}`).then((res) => res.text());

  // Load the HTML into cheerio
  const $ = cheerio.load(response);

  // Extract the content of the element with the specified data-qa attribute
  const synopsis = $('[data-qa="movie-info-synopsis"]').text().trim();
  const criticsConsensus = $('[data-qa="critics-consensus"]').text().trim();
  const audienceConsensus = $('[data-qa="audience-consensus"]').text().trim();
  const movieInfo: Record<string, string> = {};
  $(".info-item").each((index, element) => {
    const label = $(element).find("b").first().text().trim().slice(0, -1); // Removing the trailing colon
    let value = $(element).find("span").first().text().trim();

    // If the value contains links, extract the text from each link
    if ($(element).find("span a").length) {
      value = $(element)
        .find("span a")
        .map((i, el) => $(el).text().trim())
        .get()
        .join(", ");
    }
    movieInfo[label.toLowerCase()] = value.replace(/\s+/g, " ").trim();
  });
  return {
    synopsis,
    criticsConsensus,
    audienceConsensus,
    director: movieInfo.director ?? movieInfo.creators,
    writer: movieInfo.writer,
    genres: movieInfo.genre,
    starring: movieInfo.starring,
    releaseDate: movieInfo["release date (theaters)"] ?? movieInfo["release date (streaming)"],
  };
};
