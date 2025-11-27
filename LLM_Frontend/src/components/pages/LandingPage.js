import { Row, Col } from "antd";
import Meta from "../utils/Meta";
import DashboardCard from "../ui/DashboardCard";
import { cardsData } from "./CardsData";
import "./LandingPages.css";

export default function LandingPage() {
  return (
    <>
      <Meta title="HOME | Test Inventory" />

      <div className="landing-container">
        <Row gutter={[24, 24]}>
          {cardsData.map((card, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <DashboardCard
                title={card.title}
                description={card.description}
                icon={card.icon}
                link={card.link}
              />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
