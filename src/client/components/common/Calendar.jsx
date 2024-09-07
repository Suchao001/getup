import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

const Calendar = ({ events, handleDateClick, renderEventContent }) => (
  <div className="calendar-container">
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={events}
      dateClick={handleDateClick}
      eventContent={renderEventContent}
      height="auto"
      views={{
        dayGridMonth: {
          eventDisplay: 'block',
          eventContent: (arg) => !arg.event.id.startsWith('daily-') ? renderEventContent(arg) : null,
        },
        timeGridWeek: {
          eventDisplay: 'block',
          eventContent: (arg) => arg.event.id.startsWith('daily-') ? renderEventContent(arg) : null,
        },
        timeGridDay: {
          eventDisplay: 'block',
          eventContent: (arg) => arg.event.id.startsWith('daily-') ? renderEventContent(arg) : null,
        }
      }}
    />
  </div>
);

export default Calendar;