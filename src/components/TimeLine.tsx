import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import CreateTweet from "./CreateTweet";
import { RouterOutputs, trpc } from "../utils/trpc";
import Image from "next/image";

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const winScroll =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrolled = (winScroll / height) * 100;

    setScrollPosition(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
};

const Tweet = ({
  tweet,
}: {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
}) => {
  const likeMutation = trpc.tweet.like.useMutation().mutateAsync;
  const unlikeMutation = trpc.tweet.unlike.useMutation().mutateAsync;

  const hasLiked = tweet.Likes.length > 0;

  return (
    <div className="border-b border-gray-100 py-2">
      <div className="flex p-2">
        {tweet.author.image && (
          <Image
            src={tweet.author.image}
            alt={`${tweet.author.name} profile picture`}
            width={48}
            height={48}
            className="max-w-12 max-h-12 rounded-full"
          />
        )}
        <div className="ml-2">
          <div className="flex items-center">
            <p className="font-bold">
              {tweet.author.name} -{" "}
              <span className="text-sm font-normal text-gray-500">
                {dayjs(tweet.createdAt).format("DD/MM/YYYY HH:mma")}
              </span>
            </p>
          </div>
          <p className="mb-2">{tweet.text}</p>
          <p
            className="inline w-auto cursor-pointer rounded-full bg-slate-400 px-2 py-1"
            onClick={() => {
              if (hasLiked) {
                unlikeMutation({ tweetId: tweet.id });
              } else {
                likeMutation({ tweetId: tweet.id });
              }
            }}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span> 10
          </p>
        </div>
      </div>
    </div>
  );
};

function TimeLine() {
  const scrollPosition = useScrollPosition();
  // const { data } = trpc.tweet.timeline.useQuery({ limit: 2 });
  const { data, hasNextPage, fetchNextPage, isFetching } =
    trpc.tweet.timeline.useInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  useEffect(() => {
    if (scrollPosition > 85 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div>
      <CreateTweet />
      <div>
        {tweets.map((tweet) => (
          <Tweet tweet={tweet} key={tweet.id} />
        ))}
        {!hasNextPage && <p>No more items to load</p>}
      </div>
    </div>
  );
}

export default TimeLine;
