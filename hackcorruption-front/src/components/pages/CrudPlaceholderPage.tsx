import { Link } from "react-router-dom";

type CrudPlaceholderPageProps = {
  title: string;
  description: string;
  backTo: string;
  backLabel: string;
};

export default function CrudPlaceholderPage({
  title,
  description,
  backTo,
  backLabel,
}: CrudPlaceholderPageProps) {
  return (
    <main className="crud-page">
      <div className="crud-page-card">
        <div className="crud-page-eyebrow">CRUD Workspace</div>
        <h1 className="crud-page-title">{title}</h1>
        <p className="crud-page-desc">{description}</p>
        <Link className="crud-page-link" to={backTo}>
          {backLabel}
        </Link>
      </div>
    </main>
  );
}
