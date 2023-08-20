import axios from "axios";

import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { mediaUrl }: { mediaUrl: string } = await request.json();

  const response = await axios.get(`https://www.rottentomatoes.com${mediaUrl}`);

  // Load the HTML into cheerio
  const $ = cheerio.load(response.data);

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
  return NextResponse.json({
    synopsis,
    criticsConsensus,
    audienceConsensus,
    director: movieInfo.director ?? movieInfo.creators,
    writer: movieInfo.writer,
    genres: movieInfo.genre,
    starring: movieInfo.starring,
  });
};
