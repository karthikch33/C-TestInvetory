import { Table } from "antd";

export default function ProjectsTable({ columns, projectData, rowSelection }) {
  return (
    <Table
      className="Manage_Project"
      columns={columns}
      rowKey="project_id"
      dataSource={projectData}
      rowSelection={rowSelection}
      pagination={{ pageSize: 16 }}
      style={{
        overflowX: "auto",
        color: "var(--text)",
      }}
    />
  );
}
