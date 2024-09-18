import React, { forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

const Calendar = forwardRef(({ events, handleDateClick, renderEventContent, handleEventClick }, ref) => (
  <div className="font1">
    <FullCalendar
      ref={ref}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
      eventContent={renderEventContent}
      eventClick={handleEventClick}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      views={{
        dayGridMonth: {
          eventDisplay: 'block',
          eventContent: (arg) => !arg.event.id.startsWith('daily-') ? renderEventContent(arg) : null,
        },    
      }}
      height="auto"
      contentHeight="auto"
      aspectRatio={1.35}
      dayMaxEvents={3}
      moreLinkClick="popover"
      eventTimeFormat={{
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      }}
      dayHeaderFormat={{ weekday: 'short' }}
      slotLabelFormat={{
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: true,
        meridiem: 'short'
      }}
    />
  </div>
));

export default Calendar;