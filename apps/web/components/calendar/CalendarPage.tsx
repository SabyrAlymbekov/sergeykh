import React from 'react';
import Calendar from "@/components/calendar/components/Calendar";
import {GraphCalendar} from "@/components/calendar/components/GraphCalendar";
import {GraphColumn} from "@/components/calendar/components/GraphColumn";
import {LinearGraph} from "@/components/calendar/components/LinearGraph";

const CalendarPage = () => {
  return (
    <div className="Calendar">
      <div className="container flex flex-col gap-14">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <Calendar/>

        <div className="grid grid-cols-4 grid-rows-1 gap-5">

          <div className="col-span-1">
            <GraphCalendar/>

          </div>
          <div className="col-span-1">
            <LinearGraph/>

          </div>
          <div className="col-span-2">
            <GraphColumn/>

          </div>
        </div>

      </div>


    </div>
  );
};

export default CalendarPage;