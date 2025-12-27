import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { startOfDay, isBefore } from "date-fns";
import { getDayIndex, getDayName } from "../Validations"; // Ensure path is correct
import { toast } from "react-toastify";
import "../../assets/css/Doctor/Calender.css";

export default function LeaveCalendar({
  date,
  onChange,
  fromDate,
  toDate,
  doctors,
  doctorId,
  pastLeaves,
}) {
  // --- 1. Determine Status of a Date ---
  const getDateStatus = (checkDate) => {
    // A. Check Leaves
    const foundLeave = pastLeaves.find((request) => {
      let start = new Date(request.fromDate);
      start.setHours(0, 0, 0, 0);
      let end = new Date(request.toDate);
      end.setHours(23, 59, 59, 999);
      return (
        request.doctor.id === parseInt(doctorId) &&
        checkDate >= start &&
        checkDate <= end
      );
    });

    if (foundLeave) {
      const isHalfDay = foundLeave.fromTime !== foundLeave.toTime;
      return isHalfDay ? "LEAVE_HALF" : "LEAVE_FULL";
    }

    // B. Check Visiting Days (Doctor Availability)
    const selectedDoc = doctors.find((d) => d.id === parseInt(doctorId));
    if (selectedDoc && selectedDoc.visitingDays) {
      const day = checkDate.getDay(); // 0 = Sunday
      const visitingDaysArray = selectedDoc.visitingDays.split(",");
      let isAvailable = false;

      for (let visitingDaysString of visitingDaysArray) {
        const visitingDays = visitingDaysString.split("-");
        if (visitingDays.length === 2) {
          // Range (e.g., Mon-Fri)
          const start = getDayIndex(visitingDays[0]);
          const end = getDayIndex(visitingDays[1]);
          if (day >= start && day <= end) {
            isAvailable = true;
            break;
          }
        } else {
          // Single Day (e.g., Mon)
          if (visitingDays.includes(getDayName(day))) {
            isAvailable = true;
            break;
          }
        }
      }
      return isAvailable ? "AVAILABLE" : "UNAVAILABLE";
    }

    // Default fallback
    return "UNAVAILABLE";
  };

  // --- 2. Handle Date Click (Notifications) ---
  const handleDateClick = (value) => {
    const today = startOfDay(new Date());

    // Prevent Past Dates
    if (isBefore(value, today)) {
      toast.warn("Cannot select a past date.");
      return;
    }

    const status = getDateStatus(value);

    // Notify if Doctor is Unavailable
    if (status === "UNAVAILABLE") {
      toast.error("Doctor is not available on this day.");
      return;
    }

    // Notify if Doctor is on Full Leave
    if (status === "LEAVE_FULL") {
      toast.info("Doctor is on leave.");
      return;
    }

    // If Valid (Available or Half Day), trigger parent update
    onChange(value);
  };

  // --- 3. Assign CSS Classes ---
  const getTileClassName = ({ date: tileDate, view }) => {
    if (view !== "month") return null;

    const today = startOfDay(new Date());
    // Check if it is the currently selected date
    const isSelected =
      date && tileDate.toDateString() === new Date(date).toDateString();

    if (isSelected) return "highlighted-date";

    const status = getDateStatus(tileDate);

    // Visually gray out past dates
    if (isBefore(tileDate, today)) return "tile-past";

    switch (status) {
      case "LEAVE_FULL":
        return "tile-leave-full";
      case "LEAVE_HALF":
        return "tile-leave-half";
      case "AVAILABLE":
        return "tile-available"; // This class makes it green
      case "UNAVAILABLE":
        return "tile-unavailable";
      default:
        return null;
    }
  };

  // --- 4. Render Dots Content ---
  const getTileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const status = getDateStatus(date);

    // Minimalist dots
    if (status === "LEAVE_FULL")
      return <div className="dot-indicator dot-leave"></div>;
    if (status === "LEAVE_HALF")
      return <div className="dot-indicator dot-half"></div>;

    return null;
  };

  return (
    <div className="calendar-container-styled">
      <Calendar
        onClickDay={handleDateClick}
        value={date}
        className="reactCalender professional-calendar"
        tileClassName={getTileClassName}
        tileContent={getTileContent}
        next2Label={null}
        prev2Label={null}
        minDetail="month"
      />

      {/* Legend */}
      <div className="legend-container">
        <div className="legend-item">
          <span className="legend-dot dot-available"></span> Available
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-unavailable"></span> Unavailable
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-leave"></span> On Leave
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-half"></span> Half Day
        </div>
      </div>
    </div>
  );
}
