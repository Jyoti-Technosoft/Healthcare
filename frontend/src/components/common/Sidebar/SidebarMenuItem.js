import React from "react";

const SidebarMenuItem = ({
  activeTab,
  tabName,
  label,
  icon,
  aliases = [],
  onClick,
}) => {

  const isActive = activeTab === tabName || aliases.includes(activeTab);

  return (
    <li
      className={isActive ? "active" : ""}
      onClick={() => onClick(tabName)}
      style={{ cursor: "pointer" }}
    >
      <img src={icon} alt={label} />
      <span>{label}</span>
    </li>
  );
};

export default SidebarMenuItem;
