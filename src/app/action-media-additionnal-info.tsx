"use server";
import type { MediaAdditionnalInfo } from "@/types/movies";
import * as cheerio from "cheerio";

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
        .map((_, el) => $(el).text().trim())
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
