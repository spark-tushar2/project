import React, { useState, useEffect } from "react";

const RecurringDatePicker = ({ onChange }) => {
  // Component state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [recurrenceType, setRecurrenceType] = useState("weekly");
  const [interval, setInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [monthlyType, setMonthlyType] = useState("dayOfMonth");
  const [monthlyDay, setMonthlyDay] = useState(1);
  const [monthlyWeek, setMonthlyWeek] = useState("first");
  const [monthlyWeekDay, setMonthlyWeekDay] = useState("monday");
  const [previewDates, setPreviewDates] = useState([]);

  // Days of week
  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  // Monthly week options
  const weekOptions = [
    { id: "first", label: "First" },
    { id: "second", label: "Second" },
    { id: "third", label: "Third" },
    { id: "fourth", label: "Fourth" },
    { id: "last", label: "Last" },
  ];

  // Handle day selection
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Generate date preview
  useEffect(() => {
    const dates = generatePreviewDates();
    setPreviewDates(dates);
    onChange({
      startDate,
      endDate,
      recurrenceType,
      interval,
      selectedDays,
      monthlyType,
      monthlyDay,
      monthlyWeek,
      monthlyWeekDay,
    });
  }, [
    startDate,
    endDate,
    recurrenceType,
    interval,
    selectedDays,
    monthlyType,
    monthlyDay,
    monthlyWeek,
    monthlyWeekDay,
  ]);

  const generatePreviewDates = () => {
    const dates = [];
    const current = new Date(startDate);
    const end =
      endDate ||
      new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 3,
        startDate.getDate()
      );

    let count = 0;
    const maxCount = 12; // Limit to 12 preview dates

    while (current <= end && count < maxCount) {
      if (isRecurringDate(current)) {
        dates.push(new Date(current));
        count++;
      }
      incrementDate(current);
    }

    return dates;
  };

  const isRecurringDate = (date) => {
    switch (recurrenceType) {
      case "daily":
        return isDailyRecurring(date);
      case "weekly":
        return isWeeklyRecurring(date);
      case "monthly":
        return isMonthlyRecurring(date);
      case "yearly":
        return isYearlyRecurring(date);
      default:
        return false;
    }
  };

  const isDailyRecurring = (date) => {
    const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
    return daysDiff % interval === 0;
  };

  const isWeeklyRecurring = (date) => {
    if (!isDailyRecurring(date)) return false;
    if (selectedDays.length === 0) return true;
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return selectedDays.includes(dayName);
  };

  const isMonthlyRecurring = (date) => {
    if (
      date.getMonth() === startDate.getMonth() &&
      date.getDate() === startDate.getDate()
    ) {
      return true;
    }

    if (monthlyType === "dayOfMonth") {
      return (
        date.getDate() === monthlyDay &&
        (date.getMonth() - startDate.getMonth()) % interval === 0
      );
    } else {
      return (
        isMatchForWeekPattern(date) &&
        (date.getMonth() - startDate.getMonth()) % interval === 0
      );
    }
  };

  const isMatchForWeekPattern = (date) => {
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    if (dayName !== monthlyWeekDay.toLowerCase()) return false;

    const dayOfMonth = date.getDate();
    const weekNumber = Math.ceil(dayOfMonth / 7);

    if (monthlyWeek === "first" && weekNumber === 1) return true;
    if (monthlyWeek === "second" && weekNumber === 2) return true;
    if (monthlyWeek === "third" && weekNumber === 3) return true;
    if (monthlyWeek === "fourth" && weekNumber === 4) return true;
    if (monthlyWeek === "last") {
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      return dayOfMonth > lastDay - 7;
    }

    return false;
  };

  const isYearlyRecurring = (date) => {
    return (
      date.getMonth() === startDate.getMonth() &&
      date.getDate() === startDate.getDate() &&
      (date.getFullYear() - startDate.getFullYear()) % interval === 0
    );
  };

  const incrementDate = (date) => {
    switch (recurrenceType) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
  };

  // Render day picker for weekly recurrence
  const renderDayPicker = () => (
    <div className="day-picker">
      {days.map((day) => (
        <button
          key={day.id}
          type="button"
          className={`day ${selectedDays.includes(day.id) ? "selected" : ""}`}
          onClick={() => toggleDay(day.id)}
        >
          {day.label.charAt(0)}
        </button>
      ))}
    </div>
  );

  // Render monthly options
  const renderMonthlyOptions = () => (
    <div className="monthly-options">
      <div>
        <label>
          <input
            type="radio"
            checked={monthlyType === "dayOfMonth"}
            onChange={() => setMonthlyType("dayOfMonth")}
          />
          On day
          {monthlyType === "dayOfMonth" && (
            <input
              type="number"
              min="1"
              max="31"
              value={monthlyDay}
              onChange={(e) => setMonthlyDay(parseInt(e.target.value, 10) || 1)}
            />
          )}
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            checked={monthlyType === "dayOfWeek"}
            onChange={() => setMonthlyType("dayOfWeek")}
          />
          On the
          {monthlyType === "dayOfWeek" && (
            <div className="day-of-week-selector">
              <select
                value={monthlyWeek}
                onChange={(e) => setMonthlyWeek(e.target.value)}
              >
                {weekOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={monthlyWeekDay}
                onChange={(e) => setMonthlyWeekDay(e.target.value)}
              >
                {days.map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  // Render date preview
  const renderPreview = () => (
    <div className="preview">
      <h3>Preview of Next Occurrences:</h3>
      {previewDates.length === 0 ? (
        <p>No occurrences match your criteria</p>
      ) : (
        <ul>
          {previewDates.map((date, index) => (
            <li key={index}>
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="recurring-date-picker">
      <h2>Recurring Date Picker</h2>

      <div className="date-range">
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div>
          <label>End Date (optional):</label>
          <input
            type="date"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setEndDate(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>
      </div>

      <div className="recurrence-type">
        <label>Recurrence Pattern:</label>
        <select
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {recurrenceType !== "yearly" && (
          <div className="interval">
            <label>Every</label>
            <input
              type="number"
              min="1"
              max={
                recurrenceType === "monthly"
                  ? 12
                  : recurrenceType === "weekly"
                  ? 52
                  : 365
              }
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value, 10) || 1)}
            />
            <span>
              {recurrenceType === "daily"
                ? "day(s)"
                : recurrenceType === "weekly"
                ? "week(s)"
                : "month(s)"}
            </span>
          </div>
        )}
        {recurrenceType === "yearly" && (
          <div className="interval">
            <label>Every</label>
            <input
              type="number"
              min="1"
              max="10"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value, 10) || 1)}
            />
            <span>year(s)</span>
          </div>
        )}
      </div>

      {recurrenceType === "weekly" && renderDayPicker()}
      {recurrenceType === "monthly" && renderMonthlyOptions()}

      {renderPreview()}

      <style jsx>{`
        .recurring-date-picker {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        h2 {
          margin-top: 0;
          color: #333;
        }

        .date-range,
        .recurrence-type {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }

        .date-range > div,
        .recurrence-type > div {
          flex: 1;
          min-width: 200px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input[type="date"],
        input[type="number"],
        select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .day-picker {
          display: flex;
          gap: 10px;
          margin: 10px 0;
        }

        .day-picker .day {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .day-picker .day.selected {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
        }

        .monthly-options {
          margin: 10px 0;
        }

        .day-of-week-selector {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }

        .preview {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .preview ul {
          padding-left: 0;
          list-style-type: none;
        }

        .preview li {
          padding: 8px;
          border-bottom: 1px solid #eee;
        }

        .preview li:last-child {
          border-bottom: none;
        }

        .interval {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 10px;
        }

        .interval input {
          width: 60px;
        }
      `}</style>
    </div>
  );
};

export default RecurringDatePicker;
