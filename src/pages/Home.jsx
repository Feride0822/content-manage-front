import { useState } from "react";
import PostList from "../components/PostList";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
    setMenuOpen(false);
  };

  const savePicture = () => {
    const imageUrl = "https://picsum.photos/400/200";
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "post-image.jpg";
    a.click();
    setMenuOpen(false);
  };

  return (
    <div className="w-full flex justify-center pt-10">
      <div className="flex w-1/2 min-h-screen flex-col rounded-4xl items-center bg-gray-50">
        {/* POSTS */}
        <PostList />
      </div>
    </div>
  );
}

export default Home;
