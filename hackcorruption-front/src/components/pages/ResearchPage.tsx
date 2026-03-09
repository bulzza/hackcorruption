import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/research.css";
import type { ResearchCard } from "../../data/research";
import { publications, analyses } from "../../data/research";

function FolderIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/**
 * 1:1 behavior like your "carousel.js":
 * - horizontal scroll container
 * - dots scroll to card index
 * - active dot updates while scrolling
 */
function useDotCarousel(cardCount: number) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      // pick nearest card based on its left offset
      const children = Array.from(el.children) as HTMLElement[];
      if (!children.length) return;

      const left = el.scrollLeft;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < children.length; i++) {
        const dist = Math.abs(children[i].offsetLeft - left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setActiveIndex(best);
    };

    // initial sync + attach
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const target = children[i];
    if (!target) return;

    el.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  };

  const dots = useMemo(() => {
    return Array.from({ length: cardCount }, (_, i) => i);
  }, [cardCount]);

  return { scrollerRef, activeIndex, dots, scrollToIndex };
}

function ArticleCard({ card }: { card: ResearchCard }) {
  const vertical = card.variant === "vertical";

  return (
    <div className={`article-card ${vertical ? "vertical-card" : ""}`}>
      <div
        className={`article-image ${vertical ? "vertical-image" : ""}`}
        style={{ backgroundImage: `url('${card.image}')` }}
      />
      <div className={vertical ? "vertical-content" : "article-content"}>
        <div className="article-meta">
          <span className="meta-item">
            <FolderIcon />
            <span>{card.typeLabel}</span>
          </span>
          <span className="meta-item">
            <CalendarIcon />
            <span>{card.dateLabel}</span>
          </span>
        </div>

        <h3
          className="article-title"
          style={vertical ? { fontSize: "1.1rem", marginTop: "0.5rem" } : undefined}
        >
          {card.title}
        </h3>

        <p className="article-snippet">{card.snippet}</p>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  // publications and analyses are imported from src/data/research

  const pubCarousel = useDotCarousel(publications.length);
  const anaCarousel = useDotCarousel(analyses.length);

  return (
    <main className="research-page-main">
      {/* Hero Section */}
      <section className="research-hero">
        <div className="container research-hero-content">
          <h1 className="hero-title research-hero-title">
            Research, Policy, and Judicial Innovation
          </h1>
          <p className="hero-subtitle research-hero-subtitle">
            Independent studies, expert commentary, and data insights on emerging trends in judicial
            technology and legal policy.
          </p>
        </div>
      </section>

      {/* Research Publications */}
      <section className="research-section">
        <div className="container">
          <h2 className="section-title large">Research Publications</h2>

          <div className="research-carousel-container">
            <div className="research-carousel" ref={pubCarousel.scrollerRef}>
              {publications.map((c, idx) => (
                <ArticleCard key={`pub-${idx}`} card={c} />
              ))}
            </div>
          </div>

          <div className="carousel-controls">
            {pubCarousel.dots.map((i) => (
              <div
                key={`pub-dot-${i}`}
                className={`carousel-dot ${pubCarousel.activeIndex === i ? "active" : ""}`}
                onClick={() => pubCarousel.scrollToIndex(i)}
                role="button"
                tabIndex={0}
                aria-label={`Go to publication ${i + 1}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") pubCarousel.scrollToIndex(i);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Analysis & Opinions */}
      <section className="research-section" style={{ paddingTop: 0, paddingBottom: 80 }}>
        <div className="container">
          <h2 className="section-title large">Analysis and Opinions</h2>

          <div className="research-carousel-container" id="analyses-carousel-container">
            <div className="research-carousel" id="analyses-carousel" ref={anaCarousel.scrollerRef}>
              {analyses.map((c, idx) => (
                <ArticleCard key={`ana-${idx}`} card={c} />
              ))}
            </div>
          </div>

          <div className="carousel-controls" id="analyses-controls" style={{ marginTop: "2rem" }}>
            {anaCarousel.dots.map((i) => (
              <div
                key={`ana-dot-${i}`}
                className={`carousel-dot ${anaCarousel.activeIndex === i ? "active" : ""}`}
                data-index={i}
                onClick={() => anaCarousel.scrollToIndex(i)}
                role="button"
                tabIndex={0}
                aria-label={`Go to analysis ${i + 1}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") anaCarousel.scrollToIndex(i);
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
