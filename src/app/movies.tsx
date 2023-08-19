"use client";
import { ComponentPropsWithoutRef, FC } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { AcademicCapIcon, CalendarIcon, TvIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export const Movies: FC<ComponentPropsWithoutRef<"div">> = () => {
  const movieQuery = useQuery(["Movies"], () => axios.get<MovieQuery>("/api/movies"), { onSuccess: (data) => console.log(data) });

  const movieData = movieQuery.data?.data;
  return (
    <div className="flex gap-x-6 gap-y-8 flex-wrap">
      {movieData?.grid.list.map((movie) => (
        <div className="bg-background flex flex-col gap-2 min-h-full ">
          <a
            target="_blank"
            rel="norefferer"
            href={`https://www.rottentomatoes.com${movie.mediaUrl}`}
            className="overflow-hidden rounded-md w-fit"
          >
            <Image
              src={movie.posterUri}
              alt={movie.title}
              width={206}
              height={305}
              className="object-cover transition-all hover:scale-105"
            />
          </a>
          <h2 className="font-medium text-md max-w-[200px] overflow-clip">{movie.title}</h2>
          <span className="flex gap-1 items-center text-xs text-muted-foreground mb-4">
            <CalendarIcon className="h-4 w-4" />
            {movie.releaseDateText}
          </span>
          <div className="grid grid-cols-2 divide-x divide-muted-foreground bg-muted px-2 py-3 rounded-md mt-auto">
            <span
              className={cn("flex gap-3 items-center text-sm text-red-600 font-semibold justify-center", {
                "text-orange-600": Number(movie.criticsScore.score) >= 50,
                "text-yellow-600": Number(movie.criticsScore.score) >= 60,
                "text-cyan-600": Number(movie.criticsScore.score) >= 70,
                "text-green-600": Number(movie.criticsScore.score) >= 90,
              })}
            >
              <AcademicCapIcon className="h-5 w-5" />
              <p>{movie.criticsScore.score}%</p>
            </span>
            <span
              className={cn("flex gap-3 items-center text-sm text-red-600 font-semibold justify-center", {
                "text-orange-600": Number(movie.audienceScore.score) >= 50,
                "text-yellow-600": Number(movie.audienceScore.score) >= 60,
                "text-cyan-600": Number(movie.audienceScore.score) >= 70,
                "text-green-600": Number(movie.audienceScore.score) >= 90,
              })}
            >
              <TvIcon className="h-5 w-5" />
              <p>{movie.audienceScore.score}%</p>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
