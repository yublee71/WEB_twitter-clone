import styled from "styled-components";
import { PostTweetForm } from "../components/post-tweet-form";

const Wrapper = styled.div``;

export function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
    </Wrapper>
  );
}
