// import error404 from "../assets/images/error404.png"

const Error = () => {
  return (
    <div
      className="flex h-screen items-center justify-center overflow-hidden bg-black bg-opacity-85"
      // style={{ background: "#edf2f7" }}
    >
      <div className="relative top-10 m-[15%] flex h-screen w-screen items-center">
        <div className="container flex flex-col items-center justify-between px-5 text-gray-700 md:flex-row">
          <div className="mx-8 w-full lg:w-1/2">
            <div className="font-dark mb-8 text-7xl font-extrabold text-red-600">
              404
            </div>
            <p className="mb-8 text-2xl font-light leading-normal text-white md:text-3xl">
              Sorry we couldn't find the page you're looking for
            </p>
            <a
              href="/"
              className="duration-400 inline rounded-lg border border-transparent bg-red-500 px-5 py-3 text-sm font-medium leading-5 text-white shadow-2xl transition-all hover:bg-red-900 focus:outline-none active:bg-red-600"
            >
              Back to Homepage
            </a>
          </div>
          <div className="mx-5 my-12 w-full lg:flex lg:w-1/2 lg:justify-end">
            <img
              src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
              // src={error404}
              alt="Page not found"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
