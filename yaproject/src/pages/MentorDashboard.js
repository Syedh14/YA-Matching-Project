import React from 'react';
import Header from '../components/Header';

const days = ["MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN"];
const times = [
  "8 am",
  "10 am",
  "12 pm",
  "2 pm",
  "4 pm",
  "6 pm",
  "8 pm"
];

const sessions = [
  { day: "MON", time: "12 pm", type: "session", name: "In-Person", length: 2 },
  { day: "MON", time: "4 pm", type: "session", name: "Online", length: 1 },
  { day: "MON", time: "6 pm", type: "session", name: "In-Person", length: 1 },
  { day: "TUES", time: "10 am", type: "possible", name: "Potential Session", length: 1 },
  { day: "TUES", time: "4 pm", type: "session", name: "In-Person", length: 1 },
  { day: "THURS", time: "4 pm", type: "session", name: "In-Person", length: 1 },
  { day: "FRI", time: "10 am", type: "session", name: "Online", length: 3 },
  { day: "SAT", time: "2 pm", type: "session", name: "In-Person", length: 1 },
  { day: "SUN", time: "4 pm", type: "session", name: "Online", length: 1 }
];

const getSession = (day, time) =>
  sessions.find((s) => s.day === day && s.time === time);

  const SessionCell = ({ session }) => {
    const baseStyles = "w-full h-16 flex items-center justify-center text-sm font-medium border-x box-border";
    if (!session) return <div className={baseStyles} />;
    return (
      <div
        className={`${baseStyles} ${
          session.type === "session"
            ? "bg-secondary text-white border box-border"
            : "bg-primary text-black border box-border"
        }`}
      >
        {session.name}
      </div>
    );
  };

const MentorDashboard = () => {
  return (
    <div>
      <Header />
      <div className="p-8 min-h-full">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mt-24">
          <div className="flex-1">
            <div className="grid grid-cols-[100px_repeat(7,minmax(0,1fr))] gap-0 bg-white p-0 rounded-xl border border-gray-300 shadow-lg shadow-primary w-full overflow-hidden">
              <div className="border border-gray-300 box-border bg-gray-100"></div>
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-lg border border-gray-300 box-border bg-gray-100 py-2"
                >
                  {day}
                </div>
              ))}

              {times.map((time) => (
                <React.Fragment key={time}>
                  <div className="text-sm text-gray-700 font-medium flex items-start justify-center box-border h-16">
                    {time}
                  </div>
                  {days.map((day) => (
                    <SessionCell
                      key={`${day}-${time}`}
                      session={getSession(day, time)}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="px-6 py-3 text-lg border rounded hover:bg-primary hover:text-black transition bg-secondary text-white w-32">
                Edit
              </button>
            </div>
          </div>

          <div className="w-full lg:w-72 h-60 border border-gray-300 rounded-xl flex items-center justify-center text-center text-gray-800 text-xl font-semibold px-4 py-6 bg-white shadow-md shadow-primary cursor-pointer hover:shadow-lg transition">
            Mentee Information<br />
            (Click Here For More Information)
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;