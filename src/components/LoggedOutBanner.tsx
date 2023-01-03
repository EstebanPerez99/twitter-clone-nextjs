import { signIn, useSession } from "next-auth/react";
import React from "react";
import Container from "./Container";

function LoggedOutBanner() {
  const { data: session } = useSession();

  if (session) {
    return null;
  }

  return (
    <div className="fixed bottom-0 h-16 w-full bg-primary">
      <Container className="flex h-full items-center justify-between bg-transparent text-white">
        <p>Do not miss out </p>
        <div>
          <button
            onClick={() => signIn()}
            className="rounded-md px-4 py-2 shadow-md"
          >
            Login
          </button>
        </div>
      </Container>
    </div>
  );
}

export default LoggedOutBanner;
