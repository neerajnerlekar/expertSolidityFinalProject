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
        <h1 className="text-4xl my-0">Programmes</h1>
        <p className="text-neutral">
          Learn, build and showcase your skills alongside like-minded peers through our numerous programmes.
        </p>
      </div>
      <div className="text-center mt-8 p-10">Events</div>
    </>
  );
};

export default Programmes;
