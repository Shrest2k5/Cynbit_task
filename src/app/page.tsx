import Wizard from "@/components/Wizard";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <p className="text-sm tracking-widest text-accent uppercase">Prototype · not affiliated with Cynbit</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Build your project blueprint</h1>
      <p className="mt-3 text-muted">
        Answer four short questions and get an indicative timeline, cost range, stack and the most
        relevant Cynbit case studies. No email needed to see it.
      </p>
      <Wizard />
    </main>
  );
}
