import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import TimeLine from "../components/TimeLine";

const Home: NextPage = () => {
  // const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {JSON.stringify(session)} */}
      <TimeLine />
    </>
  );
};

export default Home;
