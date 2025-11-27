import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./DashboardCard.css";

export default function DashboardCard({ title, description, icon: Icon, link }) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(link)}
      className="dashboard-card"
    >
      <div className="card-icon">{Icon}</div>
      <div className="card-title">{title}</div>
      <div className="card-desc">{description}</div>
    </Card>
  );
}
