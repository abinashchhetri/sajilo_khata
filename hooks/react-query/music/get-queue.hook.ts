"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchQueue } from "@/services/music/music.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetQueue = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MUSIC.QUEUE],
    queryFn: fetchQueue,
    refetchInterval: 15_000,
  });

  // Backend returns { length: number, tracks: { track: ITrack, preparedAt: string }[] }
  const queueLength = data?.length ?? 0;
  const nextTrack = data?.tracks?.[0]?.track ?? null;

  return {
    hasNext: queueLength > 0,
    queueLength,
    nextTrack,
    isLoading,
  };
};
