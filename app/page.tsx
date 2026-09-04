import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="flex-1 px-8 pb-12 pt-30 max-w-4xl mx-auto w-full text-center">
      <h1 className="text-7xl font-bold">
        Coordinate your plans
        <br />
        <span className="text-accent">without all the hassle</span>
      </h1>
      <p className="text-xl text-muted-foreground">
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

      <div className="w-full border-t border-border" />

      <div className="flex justify-between w-full gap-10 my-16 text-start">
        {[
          {
            title: "Discover",
            desc: "Find unique activities available near you.",
          },
          {
            title: "Gather",
            desc: "Invite your friends with ease.",
          },
          {
            title: "Plan",
            desc: "Collaborate and coordinate your activities.",
          },
        ].map((item, index) => (
          <div key={index} className="flex-1">
            <h1 className="text-4xl font-bold">{item.title}</h1>
            <p className="text-xl text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="w-full border-t border-border" />

      <div className="my-20 text-start">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Create a Plan",
              desc: "Set your dates, location, and activities.",
            },
            {
              step: "02",
              title: "Invite your Friends",
              desc: "Invite friends or family to your plans.",
            },
            {
              step: "03",
              title: "Lock in Plans",
              desc: "Coordinate ideas and finalize your timeline with ease.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-3"
            >
              <span className="text-4xl font-extrabold text-accent">
                {item.step}
              </span>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Browser preview code display */}
      <div className="my-12 mx-auto rounded-2xl border border-border bg-card p-4 shadow-2xl overflow-hidden">
        {/* Header for browser preview, renders the three dots */}
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-4 px-2">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        {/* Display a preview of plan-page/planForm  */}
        <img
          src="/plan-preview.png"
          alt="ourtinerary plan interface preview"
          className="rounded-xl w-full object-cover"
        />
      </div>
    </div>
  );
}

export default HomePage;
