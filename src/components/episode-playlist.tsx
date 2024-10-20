"use client";

import { useGetAllEpisodes } from "@/query/get-all-episodes";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import EpisodeCard from "./common/episode-card";
import { useAnimeStore } from "@/store/anime-store";

type Props = {
  animeId: string;
  title: string;
};

const EpisodePlaylist = ({ animeId, title }: Props) => {
  const searchParams = useSearchParams();

  const episodeId = searchParams.get("episode");

  const { setSelectedEpisode } = useAnimeStore();

  const { data: episodes, isLoading } = useGetAllEpisodes(animeId);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const episodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!episodeId && episodes && !!episodes.length) {
      setSelectedEpisode(episodes[0].id as string);
    } else {
      setSelectedEpisode("");
    }
    //eslint-disable-next-line
  }, [episodes]);

  useEffect(() => {
    const episodeIndex = episodes?.findIndex(
      (episode) => episode.id === episodeId
    );

    if (
      episodeIndex !== undefined &&
      episodeIndex >= 0 &&
      episodeRefs.current[episodeIndex]
    ) {
      const episodeElement = episodeRefs.current[episodeIndex];
      const scrollContainer = scrollContainerRef.current;

      if (episodeElement && scrollContainer) {
        // Get the top offset of the episode relative to the scroll container
        const episodeOffsetTop = episodeElement.offsetTop;

        // Scroll the container directly to the episode's top position
        scrollContainer.scrollTop =
          episodeOffsetTop -
          scrollContainer.offsetHeight / 2 +
          episodeElement.offsetHeight / 2 +
          80; //Adding some extra px to achieve better positioning
      }
    }
    //eslint-disable-next-line
  }, [animeId, episodes]);

  return (
    <div className="col-span-1 flex flex-col w-full gap-5 border-[.0313rem] border-secondary rounded-md overflow-hidden lg:max-h-[80vh] max-h-[40vh] min-h-[40vh]">
      <div className="h-fit bg-[#18181a] px-5 py-3">
        <h3 className="text-lg font-semibold"> Episode Playlist</h3>
        <span className="text-sm font-thin">{title}</span>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex flex-col gap-1 px-2 pb-3 flex-grow overflow-y-auto"
      >
        {episodes?.map((episode, idx) => (
          //@ts-expect-error type mismatch
          <div key={idx} ref={(el) => (episodeRefs.current[idx] = el)}>
            <EpisodeCard variant="list" episode={episode} animeId={animeId} />
          </div>
        ))}
        {!episodes?.length && !isLoading && "No Episodes"}
        {isLoading && <PlaylistSkeleton />}
      </div>
    </div>
  );
};

const PlaylistSkeleton = () => {
  return (
    <>
      {[1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, idx) => {
        return (
          <div
            className="flex gap-5 items-center w-full relative !min-h-16 rounded-md  animate-pulse bg-slate-800"
            key={idx}
          ></div>
        );
      })}
    </>
  );
};

export default EpisodePlaylist;
