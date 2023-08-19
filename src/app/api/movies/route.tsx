import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
  const response = await axios.get<MovieQuery>(
    "https://www.rottentomatoes.com/napi/browse/movies_at_home/affiliates:disney_plus,netflix~critics:certified_fresh~genres:documentary~sort:critic_highest?page=1"
  );
  return NextResponse.json(response.data);
};
