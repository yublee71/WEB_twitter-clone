import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { Error } from "./auth-components";
import { useNavigate } from "react-router";

const errors: Record<string, string> = {
  "auth/account-exists-with-different-credential":
    "Email already registered. Try logging in with password",
};

const Button = styled.span`
  margin-top: 50px;
  margin-bottom: 10px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export function GithubButton() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      let displayedErrMsg = "Unknown error.";
      if (err instanceof FirebaseError) {
        displayedErrMsg = errors[err.code] ?? "Unknown error.";
      }
      setError(displayedErrMsg);
    }
  };
  return (
    <>
      <Button onClick={onClick}>
        <Logo src="/github-logo.svg" />
        Continue with Github
      </Button>
      {error !== "" ? <Error>{error}</Error> : null}
    </>
  );
}
