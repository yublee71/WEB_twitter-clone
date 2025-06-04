import styled from "styled-components";
import { PostTweetForm } from "../components/post-tweet-form";
import { Timeline } from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  height: 100%;
  overflow-y: auto;
  flex-grow: 1;
  max-width: 600px;
`;

export function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
