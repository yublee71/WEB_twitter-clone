import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { Error } from "../components/auth-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { ITweet } from "../components/timeline";
import { Tweet } from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  width: 100%;
  max-width: 680px;
`;

const AvatarLabel = styled.label`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
    height: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  width: 100%;
`;

export function Profile() {
  const user = auth.currentUser;
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [error, setError] = useState("");
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (!user || !user.displayName) {
      setError("Cannot change the profile picture.");
      return;
    }
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        setError("File size cannot be larger than 1Mb.");
      } else {
        const file = files[0];
        const locationRef = ref(storage, `avatars/${user?.uid}`);
        const uploadResult = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        await updateProfile(user, { photoURL: url });
        setAvatar(url);
      }
    }
  };
  const fetchTweets = async () => {
    const q = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(q);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, userName, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        userName,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      <AvatarLabel htmlFor="avatar-input">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            data-slot="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarLabel>
      <AvatarInput
        id="avatar-input"
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>
      <Error>{error}</Error>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
