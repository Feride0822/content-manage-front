import PostList from "../components/PostList";

function Home() {
  return (
    <div className="w-full flex justify-center pt-10">
      <div className="w-1/2 min-h-screen bg-gray-50 flex flex-col gap-6 p-4 rounded-3xl">
        <PostList />
      </div>
    </div>
  );
}

export default Home;
