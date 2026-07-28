import PostCard from "@/components/PostCard";
import SetupNotice from "@/components/SetupNotice";
import { getPosts, wpConfigured } from "@/lib/wp";

export const revalidate = 300;

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await getPosts({ perPage: 24 });

  return (
    <div className="container section">
      <h1>Blog</h1>
      {posts.length ? (
        <div className="grid grid--3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <SetupNotice configured={wpConfigured()} />
      )}
    </div>
  );
}
