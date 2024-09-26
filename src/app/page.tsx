export default function Home() {
  return (
    <main className="p-5 bg-white dark:bg-gray-900 antialiased">
      <div className="flex flex-col">
        <div className="w-full max-w-3xl py-4 px-4 sm:px-6 lg:px-8 m-auto items-center text-center">
          <div
            className={`transition-all duration-500 ease-in-out mt-[5vh] lg:mt-[15vh]`}
          >
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Hello World!
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
}
