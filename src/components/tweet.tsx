import styled from "styled-components";
import type { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  gap: 15px;
  width: 100%;
`;

const Photo = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 15px;
  object-fit: cover;
  overflow-clip-margin: unset;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    p {
      font-size: 14px;
    }
  }
`;

const Payload = styled.p`
  font-size: 18px;
  width: 100%;
  word-wrap: break-word;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

export function Tweet({ userName, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete?");
    if (user?.uid !== userId || !ok) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${id}`
        );
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  return (
    <Wrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <UserName>{userName}</UserName>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </div>
      <Content>
        <Payload>{tweet}</Payload>
        {photo ? <Photo src={photo} /> : null}
      </Content>
    </Wrapper>
  );
}
