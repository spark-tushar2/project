import "./styles.css";
import RecurringDatePicker from "./RecurringDatePicker";

export default function App() {
  const handleRecurrenceChange = (recurrenceData) => {
    console.log("Recurrence settings:", recurrenceData);
  };

  return (
    <div className="app">
      <h1>Recurring Event Scheduler</h1>
      <RecurringDatePicker onChange={handleRecurrenceChange} />
    </div>
  );
}
