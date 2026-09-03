import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Home() {
  return (
    <div className="flex-1 px-8 pb-12 pt-30 max-w-2xl mx-auto w-full text-[#1A1510] text-center">
      <h1 className="text-6xl font-bold">
        Coordinate your plans
        <br />
        <span className="text-[#B07030]">without all the hassle</span>
      </h1>
      <p className="text-base text-[#7A6A52]">
        <span className="text-lg font-bold">ourtinerary</span> allows you to
        coordinate your plans with friends effectively and easily
      </p>

      <div className="my-16">
        <Link
          href="/auth/signup"
          className={`${buttonVariants({ size: "lg", variant: "default" })} py-5 px-10 text-lg font-bold`}
        >
          Get Started →
        </Link>
      </div>

      <div className="w-full border-t border-[rgba(26,21,16,0.12)]" />

      <div className="flex justify-between w-full gap-4 my-16 text-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Discover</h1>
          <p className="text-base text-[#7A6A52]">
            Find new activities available near you
          </p>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Gather</h1>
          <p className="text-base text-[#7A6A52]">
            Invite your friends with ease
          </p>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Plan</h1>
          <p className="text-base text-[#7A6A52]">
            Collaborate and coordinate your activities
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
