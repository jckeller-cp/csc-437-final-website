import "./StatCard.css";

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{title}</span>
    </div>
  );
}

export default StatCard;
