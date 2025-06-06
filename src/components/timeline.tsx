import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { Tweet } from "./tweet";
import type { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  userName: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  height: auto;
`;

export function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  /* non-realtime update */
  //   const fetchTweets = async () => {
  //     const tweetsQuery = query(
  //       collection(db, "tweets"),
  //       orderBy("createdAt", "desc")
  //     );
  //     const spanshot = await getDocs(tweetsQuery);
  //     const tweets = spanshot.docs.map((doc) => {
  //       const { tweet, createdAt, userId, userName, photo } = doc.data();
  //       return {
  //         tweet,
  //         createdAt,
  //         userId,
  //         userName,
  //         photo,
  //         id: doc.id,
  //       };
  //     });
  //     setTweets(tweets);
  //   };
  //   useEffect(() => {
  //     fetchTweets();
  //   }, []);
  /*****************/
  /* realtime update */
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const q = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      unsubscribe = await onSnapshot(q, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userName, userId, photo } = doc.data();
          return { tweet, createdAt, userName, userId, photo, id: doc.id };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
