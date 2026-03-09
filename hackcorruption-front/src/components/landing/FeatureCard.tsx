import "../../styles/landing.css";

type Props = {
  img: string;
  alt: string;
  title: string;
  desc: string;
};

export default function FeatureCard({ img, alt, title, desc }: Props) {
  return (
    <div className="feature-card">
      <div className="feature-img-wrapper">
        <img src={img} alt={alt} className="feature-img" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}
