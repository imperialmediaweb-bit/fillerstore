import Link from "next/link";
import Slider from "@/components/Slider";
import ProductCard from "@/components/ProductCard";
import PostCard from "@/components/PostCard";
import SetupNotice from "@/components/SetupNotice";
import { getProducts, getPosts, wpConfigured } from "@/lib/wp";

export const revalidate = 300;

export default async function HomePage() {
  const [products, posts] = await Promise.all([
    getProducts({ perPage: 8 }),
    getPosts({ perPage: 3 }),
  ]);

  // sliderul mare: pozele produselor; dacă nu-s produse, pozele articolelor
  const heroSlides = products
    .filter((p) => p.images[0])
    .slice(0, 6)
    .map((p) => ({
      src: p.images[0].src,
      alt: p.images[0].alt,
      title: p.name,
      href: `/produse/${p.slug}`,
    }));
  if (!heroSlides.length) {
    heroSlides.push(
      ...posts
        .filter((p) => p.image)
        .map((p) => ({ src: p.image.src, alt: p.image.alt, href: `/blog/${p.slug}` }))
    );
  }

  const empty = !products.length && !posts.length;

  return (
    <>
      {heroSlides.length > 0 && (
        <section className="hero">
          <Slider slides={heroSlides} variant="hero" autoPlayMs={5000} />
        </section>
      )}

      {empty && (
        <div className="container">
          <SetupNotice configured={wpConfigured()} />
        </div>
      )}

      {products.length > 0 && (
        <section className="container section">
          <div className="section__head">
            <h2>Produse</h2>
            <Link href="/produse" className="section__more">Vezi toate →</Link>
          </div>
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="container section">
          <div className="section__head">
            <h2>Noutăți</h2>
            <Link href="/blog" className="section__more">Tot blogul →</Link>
          </div>
          <div className="grid grid--3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
