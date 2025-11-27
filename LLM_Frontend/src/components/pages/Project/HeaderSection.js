import { Button, Input } from "antd";
import { FaFolderOpen } from "react-icons/fa";

const { Search } = Input;

export default function HeaderSection({
  handleSearch,
  handleSearchChange,
  showCreate,
  showEdit,
  showDelete
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        color: "var(--text)",
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            background: "var(--card-bg)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)",
          }}
        >
          <FaFolderOpen size={20} color="#0ea5e9" />
        </div>

        <div>
          <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22, color: "var(--text)" }}>
            Projects
          </h2>
          <p style={{ margin: 0, color: "var(--text-soft)", fontSize: 13 }}>
            Manage all your test inventory projects
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", gap: 12 }}>
        <Button type="primary" onClick={showCreate}>Create</Button>
        <Button onClick={showEdit}>Edit</Button>
        <Button danger onClick={showDelete}>Delete</Button>

        <Search
          placeholder="Search projects"
          onSearch={handleSearch}
          onChange={handleSearchChange}
          allowClear
          style={{ width: 260 }}
        />
      </div>
    </div>
  );
}
