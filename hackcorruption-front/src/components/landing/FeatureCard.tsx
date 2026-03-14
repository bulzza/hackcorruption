import "../../styles/landing.css";

type Props = {
  index: number;
  img: string;
  alt: string;
  title: string;
  desc: string;
};

export default function FeatureCard({ index, img, alt, title, desc }: Props) {
  return (
    <article className="feature-card">
      <div className="feature-img-wrapper">
        <img src={img} alt={alt} className="feature-img" />
      </div>

      <div className="feature-card-content">
        <span className="feature-index">{String(index).padStart(2, "0")}</span>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
      </div>
    </article>
  );
}
