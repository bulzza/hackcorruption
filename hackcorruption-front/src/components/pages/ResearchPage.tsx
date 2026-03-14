import { useEffect, useState, type CSSProperties } from "react";
import "../../styles/research.css";
import type { ResearchCard } from "../../data/research";
import { publications, analyses } from "../../data/research";
import { useI18n } from "../../i18n/useI18n";
import type { Lang, TKey } from "../../i18n/translations";

function FolderIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

function getDateFromISO(dateISO: string) {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1));
}

function getLocale(lang: Lang) {
  if (lang === "MK") return "mk-MK";
  if (lang === "AL") return "sq-AL";
  return "en-US";
}

function formatDateLabel(dateISO: string, lang: Lang) {
  return new Intl.DateTimeFormat(getLocale(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(getDateFromISO(dateISO));
}

function getDateBadgeParts(dateISO: string, lang: Lang) {
  const parsedDate = getDateFromISO(dateISO);
  return {
    day: String(parsedDate.getUTCDate()).padStart(2, "0"),
    month: new Intl.DateTimeFormat(getLocale(lang), {
      month: "short",
      timeZone: "UTC",
    })
      .format(parsedDate)
      .slice(0, 3)
      .toUpperCase(),
  };
}

function getCardsPerRow(width: number) {
  if (width <= 640) return 1;
  if (width <= 1100) return 2;
  return 3;
}

function chunkCards(cards: ResearchCard[], chunkSize: number) {
  const chunks: ResearchCard[][] = [];

  for (let index = 0; index < cards.length; index += chunkSize) {
    chunks.push(cards.slice(index, index + chunkSize));
  }

  return chunks;
}

function ArticleCard({
  card,
  lang,
  t,
}: {
  card: ResearchCard;
  lang: Lang;
  t: (key: TKey) => string;
}) {
  const { day, month } = getDateBadgeParts(card.dateISO, lang);
  const typeLabel = t(card.typeKey);
  const dateLabel = formatDateLabel(card.dateISO, lang);

  return (
    <article className="research-article-card">
      <div className="research-image-wrap">
        <div
          className="research-article-image"
          style={{ backgroundImage: `url('${card.image}')` }}
        />

        <div className="research-date-badge">
          <span className="research-date-day">{day}</span>
          <span className="research-date-month">{month}</span>
        </div>
      </div>

      <div className="research-card-content">
        <div className="research-category">{typeLabel}</div>

        <h3 className="research-card-title">{t(card.titleKey)}</h3>

        <p className="research-card-snippet">{t(card.snippetKey)}</p>

        <div className="research-card-meta">
          <span className="meta-item">
            <FolderIcon />
            <span>{typeLabel}</span>
          </span>
          <span className="meta-item">
            <CalendarIcon />
            <span>{dateLabel}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

function ResearchSliderRow({
  title,
  cards,
  cardsPerRow,
  lang,
  t,
}: {
  title: string;
  cards: ResearchCard[];
  cardsPerRow: number;
  lang: Lang;
  t: (key: TKey) => string;
}) {
  const [page, setPage] = useState(0);
  const pages = chunkCards(cards, cardsPerRow);
  const safePageCount = Math.max(1, pages.length);
  const maxPage = safePageCount - 1;

  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage]);

  return (
    <section className="research-slider-row">
      <div className="research-slider-row-header">
        <div>
          <h3 className="research-slider-row-title">{title}</h3>
        </div>

        {pages.length > 1 && (
          <div className="research-slider-actions" aria-label={`${title} slider controls`}>
            <button
              type="button"
              className="research-slider-arrow"
              onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
              disabled={page === 0}
              aria-label={`Previous ${title.toLowerCase()}`}
            >
              <ChevronIcon direction="left" />
            </button>

            <button
              type="button"
              className="research-slider-arrow"
              onClick={() => setPage((currentPage) => Math.min(maxPage, currentPage + 1))}
              disabled={page === maxPage}
              aria-label={`Next ${title.toLowerCase()}`}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        )}
      </div>

      <div className="research-slider-window">
        <div
          className="research-slider-track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((items, pageIndex) => (
            <div
              className="research-slide research-slide-single-row"
              key={`${title}-page-${pageIndex}`}
              style={
                {
                  "--research-columns": String(cardsPerRow),
                } as CSSProperties
              }
            >
              {items.map((card, index) => (
                <ArticleCard
                  key={`${title}-card-${pageIndex}-${index}`}
                  card={card}
                  lang={lang}
                  t={t}
                />
              ))}

              {items.length < cardsPerRow &&
                Array.from({ length: cardsPerRow - items.length }).map((_, index) => (
                  <div
                    key={`${title}-placeholder-${pageIndex}-${index}`}
                    className="research-article-card research-article-card-placeholder"
                    aria-hidden="true"
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="research-slider-dots" aria-label={`${title} pages`}>
          {pages.map((_, index) => (
            <button
              key={`${title}-dot-${index}`}
              type="button"
              className={`research-slider-dot ${index === page ? "active" : ""}`}
              onClick={() => setPage(index)}
              aria-label={`Go to ${title.toLowerCase()} page ${index + 1}`}
              aria-current={index === page ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ResearchPage() {
  const { t, lang } = useI18n();
  const [cardsPerRow, setCardsPerRow] = useState(() =>
    typeof window === "undefined" ? 3 : getCardsPerRow(window.innerWidth),
  );

  useEffect(() => {
    const handleResize = () => {
      setCardsPerRow(getCardsPerRow(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="research-page-main">
      <section className="research-hero">
        <div className="container research-hero-content">
          <span className="research-hero-label">{t("research_hero_label")}</span>
          <h1 className="research-hero-title">{t("research_hero_title")}</h1>
          <p className="research-hero-subtitle">{t("research_hero_subtitle")}</p>
        </div>
      </section>

      <section className="research-grid-section">
        <div className="container">
          <div className="research-slider-shell">
            <div className="research-slider-rows">
              <ResearchSliderRow
                title={t("research_row_publications")}
                cards={publications}
                cardsPerRow={cardsPerRow}
                lang={lang}
                t={t}
              />
              <ResearchSliderRow
                title={t("research_row_analyses")}
                cards={analyses}
                cardsPerRow={cardsPerRow}
                lang={lang}
                t={t}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
