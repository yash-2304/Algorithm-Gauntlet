import GridCanvas from "./components/GridCanvas";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center pt-10">
      <header className="w-full flex justify-center py-6 bg-black">
        <div className="rounded-xl ">
          <h1 className="text-white text-3xl lg:text-4xl font-bold tracking-wide">
            Algorithm Gauntlet
          </h1>
        </div>
      </header>

      <div className="w-full flex flex-col items-center ">

        <GridCanvas />
      </div>
    </main>
  );
}
