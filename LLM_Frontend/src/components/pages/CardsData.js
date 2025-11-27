import { FaProjectDiagram, FaUpload } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

export const cardsData = [
  {
    title: "Projects",
    description: "Manage all your projects",
    icon: <FaProjectDiagram />,
    link: "/project/manageprojects",
  },
  {
    title: "Tables",
    description: "Upload and manage tables",
    icon: <FaUpload />,
    link: "/connections/flatfile",
  },
  {
    title: "Workspace",
    description: "View your workspace",
    icon: <MdOutlineWorkOutline />,
    link: "/workspace",
  },
];
