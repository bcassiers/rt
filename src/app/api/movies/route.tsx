import { FilterOptions } from "@/types/rotten-tomatoes";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const filters: FilterOptions = await request.json();
  let filterElements = [];
  if (filters.affiliate && filters.affiliate.length > 0) filterElements.push(`affiliates:${filters.affiliate.join(",")}`);
  if (filters.genre && filters.genre.length > 0) filterElements.push(`genres:${filters.genre.join(",")}`);
  if (filters.sort) filterElements.push(`sort:${filters.sort}`);
  if (filters.criticsScore && filters.criticsScore.length > 0) filterElements.push(`critics:${filters.criticsScore.join(",")}`);
  if (filters.audienceScore && filters.audienceScore.length > 0) filterElements.push(`audience:${filters.audienceScore.join(",")}`);

  const filterQuery = filterElements.join("~");

  const response = await axios.get<MovieQuery>(`https://www.rottentomatoes.com/napi/browse/movies_at_home/${filterQuery}?page=1`);
  return NextResponse.json(response.data);
};
