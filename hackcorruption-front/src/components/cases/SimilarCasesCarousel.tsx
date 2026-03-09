import { useMemo, useState, useEffect } from "react";
import type { CaseItem } from "../../data/cases";
import { Link } from "react-router-dom";

type Props = {
  items: CaseItem[];
  title?: string;
};

function truncateText(text: string, maxLength: number) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export default function SimilarCasesCarousel({ items, title }: Props) {
  const [page, setPage] = useState(0);

  const pages = useMemo(() => {
    const chunkSize = 3;
    const chunks: CaseItem[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
  }, [items]);

  const maxPage = Math.max(0, pages.length - 1);
  const safePage = Math.min(page, maxPage);

  // keep page in-range when items change
  useEffect(() => {
    if (page > maxPage) setPage(maxPage);
  }, [page, maxPage]);

  if (!items?.length) return null;

  return (
    <section className="similar-cases-wrapper" style={{ marginTop: "3rem" }}>
      <h2 className="section-title">{title ?? "Similar Cases"}</h2>

      <div className="similar-cases-carousel" aria-label="Similar cases carousel">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${safePage * 100}%)` }}
        >
          {pages.map((chunk, idx) => (
            <div className="carousel-slide" key={idx}>
              {chunk.map((c) => (
                <div className="carousel-item" key={c.id}>
                  <Link
                    to={`/data/cases/${encodeURIComponent(c.id)}`}
                    className="similar-case-card"
                  >
                    <div className="similar-case-title">{c.id}</div>

                    <div className="similar-details-grid">
                      <div className="similar-field-group">
                        <div className="similar-label">Court</div>
                        <div className="similar-value">{c.court}</div>
                      </div>

                      <div className="similar-field-group">
                        <div className="similar-label">Judge</div>
                        <div className="similar-value">{c.judge}</div>
                      </div>

                      <div className="similar-field-group">
                        <div className="similar-label">Decision</div>
                        <div className="similar-value">{c.decisionDate}</div>
                      </div>

                      <div className="similar-field-group">
                        <div className="similar-label">Duration</div>
                        <div className="similar-value">{c.durationDays} days</div>
                      </div>

                      <div className="similar-field-group full-width">
                        <div className="similar-label">Summary</div>
                        <div className="similar-value similar-summary">
                          {truncateText(c.summary, 150)}
                        </div>
                      </div>
                    </div>

                    <div className="similar-view-more">View more</div>
                    <div className="similarity-badge">Similar</div>
                  </Link>
                </div>
              ))}

              {/* fill empty slots to always keep 3 columns */}
              {chunk.length < 3 &&
                Array.from({ length: 3 - chunk.length }).map((_, i) => (
                  <div className="carousel-item is-empty" key={`empty-${idx}-${i}`} />
                ))}
            </div>
          ))}
        </div>

        {pages.length > 1 && (
          <div className="carousel-dots" aria-label="Carousel pagination">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`dot ${i === safePage ? "active" : ""}`}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === safePage ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
