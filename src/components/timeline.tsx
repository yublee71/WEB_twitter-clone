import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
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
`;

export function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
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
