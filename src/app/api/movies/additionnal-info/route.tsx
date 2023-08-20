import axios from "axios";

import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { mediaUrl }: { mediaUrl: string } = await request.json();
  console.log({ mediaUrl });

  const response = await axios.get(`https://www.rottentomatoes.com${mediaUrl}`);

  // Load the HTML into cheerio
  const $ = cheerio.load(response.data);

  // Extract the content of the element with the specified data-qa attribute
  const synopsis = $('[data-qa="movie-info-synopsis"]').text().trim();
  const criticsConsensus = $('[data-qa="critics-consensus"]').text().trim();
  const audienceConsensus = $('[data-qa="audience-consensus"]').text().trim();
  return NextResponse.json({ synopsis, criticsConsensus, audienceConsensus });
};
