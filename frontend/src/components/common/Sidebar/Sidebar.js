import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";

import { setActiveTab } from "../../../actions/submenuActions";
import {
  getDoctorsWithIdApi,
  getReceptionistApi,
  getPatientApi,
} from "../../Api";
import SidebarMenuItem from "./SidebarMenuItem";
import { getMenuForRole, DASHBOARD_ITEM } from "./SidebarMenus";

import maleRecep from "../../../assets/img/maleRecep.png";
import female2 from "../../../assets/img/female2.png";

export default function Sidebar() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.submenu.activeTab);

  const userId = Cookies.get("userId");
  const userRole = Cookies.get("role");
  const authToken = Cookies.get("authToken");

  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    image: "",
    designation: "",
  });

  const menuItems = getMenuForRole(userRole);

  const setMenu = (menu) => {
    if (activeTab !== menu) dispatch(setActiveTab(menu));
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (userRole === "Receptionist") {
          const data = await getReceptionistApi(userId);
          setProfileData({ name: data.name, gender: data.gender });
        } else if (userRole === "Patient") {
          const data = await getPatientApi(userId, authToken);
          setProfileData({ name: data.name, gender: data.gender });
        } else if (userRole === "Doctor") {
          const data = await getDoctorsWithIdApi(userId, authToken);
          setProfileData({
            name: data.name,
            image: data.doctorImageData,
            designation: data.designation,
          });
        } else {
          setProfileData({ name: "Admin" });
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserData();
  }, [userId, userRole, authToken]);

  const getProfileImage = () => {
    if (userRole === "Doctor" && profileData.image)
      return `data:image/png;base64,${profileData.image}`;
    return (profileData.gender || "").toLowerCase() === "female"
      ? female2
      : maleRecep;
  };

  return (
    <div
      className="sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1020,
      }}
    >
      <div className="logo d-flex align-items-center gap-2 justify-content-center py-2" style={{ cursor: "pointer" }} onClick={() => setMenu("dashboard")}>
        <div
          className="rounded-2 d-flex align-items-center justify-content-center text-white shadow-sm"
          style={{ width: "34px", height: "34px", backgroundColor: "#006194" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>local_hospital</span>
        </div>
        <div className="text-start">
          <span className="fw-bold d-block text-dark leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", lineHeight: "1.1" }}>
            AegisHealth
          </span>
          <span className="text-secondary text-uppercase fw-semibold" style={{ fontSize: "9px", letterSpacing: "0.8px" }}>
            Clinical Portal
          </span>
        </div>
      </div>

      <div className="profile">
        <img src={getProfileImage()} alt="Profile" className="profile-img" />
        <div className="profile-info">
          <h3>{profileData.name}</h3>
          <p>{userRole}</p>
          {userRole === "Doctor" && <small>{profileData.designation}</small>}
        </div>
      </div>

      <div className="divider" />

      <ul className="menu">
        {/* Dashboard Link */}
        <SidebarMenuItem
          activeTab={activeTab}
          tabName={DASHBOARD_ITEM.tab}
          label={DASHBOARD_ITEM.label}
          icon={DASHBOARD_ITEM.icon}
          onClick={setMenu}
        />

        {/* Role Links */}
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={index}
            activeTab={activeTab}
            tabName={item.tab}
            label={item.label}
            icon={item.icon}
            aliases={item.aliases}
            onClick={setMenu}
          />
        ))}
      </ul>
    </div>
  );
}
