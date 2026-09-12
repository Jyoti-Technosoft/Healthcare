import React, { useState, useEffect } from "react";
import {
  highlightDateRange,
  getCurrentDate,
  getDayIndex,
  getDayName,
} from "../Validations";
import {
  doctorLeaveRequest,
  getDoctorsWithIdApi,
  getDoctorLeaveRequest,
  getDoctorsApi,
} from "../Api";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";
import LeaveCalendar from "./LeaveCalendar";


import "../../assets/css/Doctor/AddLeave.css";


export default function AddDoctorLeaves() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [reason, setReason] = useState("");
  const [totalDays, setTotalDays] = useState(0);

  const [date, setDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [pastLeaves, setPastLeaves] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const isSameDate = fromDate === toDate;
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userId");
  const [doctors, setDoctors] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [leaveRequests, setLeaveRequests] = useState([]);

  const dispatch = useDispatch();

const setMenu = (submenu) => {

    dispatch(setActiveTab(submenu));
  };
 

  const onChange = (newDate) => {
    setDate(newDate);
  };

  // --- LOGIC: Check if a specific date is a working day for the doctor ---
  const isDateAvailable = (checkDate, visitingDaysStr) => {
    if (!visitingDaysStr) return false;

    const day = checkDate.getDay();
    const visitingDaysArray = visitingDaysStr.split(",");

    for (let visitingDaysString of visitingDaysArray) {
      const visitingDays = visitingDaysString.split("-");
      if (visitingDays.length === 2) {
        const startDayIndex = getDayIndex(visitingDays[0]);
        const endDayIndex = getDayIndex(visitingDays[1]);
        if (day >= startDayIndex && day <= endDayIndex) {
          return true;
        }
      } else {
        const dayName = getDayName(day);
        if (visitingDays.includes(dayName)) {
          return true;
        }
      }
    }
    return false;
  };

  // --- LOGIC: Calculate Total Days excluding "Off Days" ---
  const calculateEffectiveLeaveDays = (start, end) => {
    if (!start || !end || !doctorId || doctors.length === 0) {
      setTotalDays(0);
      return;
    }

    const selectedDoc = doctors.find((d) => d.id === parseInt(doctorId));

    if (!selectedDoc || !selectedDoc.visitingDays) {
      const diffTime = Math.abs(new Date(end) - new Date(start));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);
      return;
    }

    let count = 0;
    let currentDate = new Date(start);
    const stopDate = new Date(end);

    currentDate.setHours(0, 0, 0, 0);
    stopDate.setHours(0, 0, 0, 0);

    while (currentDate <= stopDate) {
      if (isDateAvailable(currentDate, selectedDoc.visitingDays)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setTotalDays(count);
  };

  const handleFromDateChange = (event) => {
    const selectedDate = event.target.value;
    setFromDate(selectedDate);
    setToDate(selectedDate);

    calculateEffectiveLeaveDays(selectedDate, selectedDate);
    highlightDateRange(selectedDate, selectedDate, setHighlightedDates);
  };

  const handleToDateChange = (event) => {
    const selectedDate = event.target.value;
    setToDate(selectedDate);

    calculateEffectiveLeaveDays(fromDate, selectedDate);
    highlightDateRange(fromDate, selectedDate, setHighlightedDates);
  };

  useEffect(() => {
    if (fromDate && toDate) {
      calculateEffectiveLeaveDays(fromDate, toDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, doctorId]);

  const handleSubmit = async (event) => {
    try {
      if (totalDays === 0) {
        toast.error("Selected dates are non-working days. Leave not required.");
        return;
      }

      const doctorInfo = await getDoctorsWithIdApi(userId, token);
      const fetchedDoctorId = doctorInfo.id;
      await doctorLeaveRequest(
        fromDate,
        toDate,
        fromTime,
        toTime,
        reason,
        fetchedDoctorId,
        token
      );
      toast.success("Leave applied successfully!!");

      setReason("");
      setFromDate("");
      setToDate("");
      setFromTime("");
      setToTime("");
      setIsHalfDay(false);
      const data = await getDoctorLeaveRequest(fetchedDoctorId, token);
      setPastLeaves(data);
    } catch (error) {
      toast.error("Leave request failed!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorInfo = await getDoctorsWithIdApi(userId, token);
        const fetchedDoctorId = doctorInfo.id;
        setDoctorId(fetchedDoctorId);
        const data = await getDoctorLeaveRequest(fetchedDoctorId, token);
        setPastLeaves(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId, token]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        if (response) setDoctors(response);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleLeaveTypeChange = (event) => {
    setIsHalfDay(event.target.value === "halfDay");
    if (event.target.value === "fullDay") {
      setFromTime("");
      setToTime("");
    }
  };

  useEffect(() => {
    setLeaveRequests([]);
  }, []);

  return (
    <div className="background_part">
      <div className="register-card">
        {/* Back Button */}
        <div
          className="register-back-btn"
          onClick={() => setMenu("doctorLeaves")}
        >
          <i
            className="bi bi-arrow-left"
            style={{ fontSize: "25px", color: "grey" }}
          ></i>
        </div>

        <h3 className="register-title">Apply Doctor Leave</h3>

        {/* Main Layout Split: Calendar Left, Form Right */}
        <div className="row mt-4">
          {/* Left Side: Calendar */}
          <div className="col-md-6">
            <LeaveCalendar
              date={date}
              onChange={onChange}
              highlightedDates={highlightedDates}
              fromDate={fromDate}
              toDate={toDate}
              doctors={doctors}
              doctorId={doctorId}
              pastLeaves={pastLeaves}
            />
          </div>

          {/* Right Side: Form */}
          <div className="col-md-6">
            {/* Date Inputs using form-grid for alignment */}
            <div className="form-grid">
              <div>
                <label htmlFor="fromDate" className="form-label">
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  className="form-control input-field"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  min={getCurrentDate()}
                />
              </div>
              <div>
                <label htmlFor="toDate" className="form-label">
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  id="toDate"
                  className="form-control input-field"
                  value={toDate}
                  onChange={handleToDateChange}
                  min={getCurrentDate()}
                />
              </div>
            </div>

            {/* Days Calculation Info */}
            {fromDate && toDate && (
              <div className="mt-2 mb-3">
                <small className="text-muted">
                  Total Days: <strong>{totalDays > 0 ? totalDays : 0}</strong>
                </small>
                <br />
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  <i>(Excluding Off/Non-working days)</i>
                </small>
              </div>
            )}

            {/* Leave Type (Full/Half) */}
            {fromDate && toDate && isSameDate && (
              <div className="form-grid-full mt-3">
                <label className="form-label">Leave Type</label>
                <div className="d-flex align-items-center gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="leaveType"
                      id="fullDay"
                      value="fullDay"
                      checked={!isHalfDay}
                      onChange={handleLeaveTypeChange}
                    />
                    <label className="form-check-label" htmlFor="fullDay">
                      Full Day
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="leaveType"
                      id="halfDay"
                      value="halfDay"
                      checked={isHalfDay}
                      onChange={handleLeaveTypeChange}
                    />
                    <label className="form-check-label" htmlFor="halfDay">
                      Half Day
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Time Inputs (Only if Half Day) */}
            {fromDate && toDate && isSameDate && isHalfDay && (
              <div className="form-grid mt-3">
                <div>
                  <label htmlFor="fromTime" className="form-label">
                    From Time
                  </label>
                  <input
                    type="time"
                    name="fromTime"
                    id="fromTime"
                    className="form-control input-field"
                    onChange={(e) => setFromTime(e.target.value)}
                    value={fromTime}
                  />
                </div>
                <div>
                  <label htmlFor="toTime" className="form-label">
                    To Time
                  </label>
                  <input
                    type="time"
                    name="toTime"
                    id="toTime"
                    className="form-control input-field"
                    onChange={(e) => setToTime(e.target.value)}
                    value={toTime}
                  />
                </div>
              </div>
            )}

            {/* Reason Textarea */}
            <div className="form-grid-full mt-3">
              <label htmlFor="reason" className="form-label">
                Reason
              </label>
              <textarea
                id="reason"
                className="form-control input-field"
                style={{ height: "auto", minHeight: "80px" }}
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={70}
              />
            </div>

            {/* Submit Button */}
            <div className="button-row">
              <button
                onClick={handleSubmit}
                className="register-btn"
                type="submit"
              >
                Apply Leave
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
