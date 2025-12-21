import PostList from "../components/PostList";

function Home() {
  return (
    <div className="w-full flex justify-center pt-4 sm:pt-8 px-2 sm:px-0">
      <div
        className="
          w-full
          sm:w-[90%]
          md:w-[70%]
          lg:w-[50%]
          min-h-screen
          bg-gray-50
          flex
          flex-col
          gap-6
          p-3
          sm:p-5
          rounded-none
          sm:rounded-3xl
        "
      >
        <PostList />
      </div>
    </div>
  );
}

export default Home;
