import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Programmes",
  description: "Explore the encode programmes.",
});

const Programmes: NextPage = () => {
  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Get Recruited with Encode</h1>
        <p className="text-neutral">
          We help place the best technical and non-technical Encode Alumni at leading Emerging Tech companies.
        </p>
      </div>
      <div className="text-center mt-8 p-10">
        <button className="btn btn-accent">Explore new job opportunities</button>
      </div>
    </>
  );
};

export default Programmes;
