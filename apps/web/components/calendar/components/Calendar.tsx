'use client'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@workspace/ui/styles/calendar.css'
import '@schedule-x/theme-default/dist/index.css'
import { useState } from "react"
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop"

function Calendar() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const dragAndDropPlugin = useState(() => createDragAndDropPlugin())[0]

  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ],
    calendars: {
      personal: {
        colorName: 'personal',
        lightColors: {
          main: '#f9d71c',
          container: '#fff5aa',
          onContainer: '#594800',
        },
        darkColors: {
          main: '#fff5c0',
          onContainer: '#fff5de',
          container: '#a29742',
        },
      },
      work: {
        colorName: 'work',
        lightColors: {
          main: '#00b0ff',  // Changed color
          container: '#b3e5fc',  // Changed color
          onContainer: '#01579b',  // Changed color
        },
        darkColors: {
          main: '#82b3c9',  // Changed color
          onContainer: '#b3e5fc',  // Changed color
          container: '#01579b',  // Changed color
        },
      },
      leisure: {
        colorName: 'leisure',
        lightColors: {
          main: '#1cf9b0',
          container: '#dafff0',
          onContainer: '#004d3d',
        },
        darkColors: {
          main: '#c0fff5',
          onContainer: '#e6fff5',
          container: '#42a297',
        },
      },
      school: {
        colorName: 'school',
        lightColors: {
          main: '#1c7df9',
          container: '#d2e7ff',
          onContainer: '#002859',
        },
        darkColors: {
          main: '#c0dfff',
          onContainer: '#dee6ff',
          container: '#426aa2',
        },
      },
    },
    events: [
      {
        title: "Meeting with Mr. boss",
        start: "2024-01-05 05:15",
        end: "2024-01-05 06:00",
        id: "98d85d98541f",
        calendarId: "work"
      },
      {
        title: "Sipping Aperol Spritz on the beach",
        start: "2024-01-05 12:00",
        end: "2024-01-05 15:20",
        id: "0d13aae3b8a1",
        calendarId: "leisure"
      },
    ],
    isDark: true,
    plugins: [eventsService, dragAndDropPlugin],
    callbacks: {
      onRender: () => {
        eventsService.getAll()
      }
    },
  })

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}

export default Calendar