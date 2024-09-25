import moment from 'moment';

const processPlans = (plans) => {
    const monthViewEvents = [];
    const timeGridEvents = [];

    plans.forEach(plan => {
      const startDate = moment(plan.start_date);
      const endDate = moment(plan.end_date);
      const priority = plan.priority; 
     
      
      monthViewEvents.push({
        id: `month-${plan.id}`,
        groupId: `group-${plan.id}`,
        title: plan.name,
        icon: plan.nameTouse,
        start: startDate.format('YYYY-MM-DD'),
        end: endDate.add(1, 'day').startOf('day').format('YYYY-MM-DD'), // เพิ่มวันแต่ไม่แสดงในวันถัดไป

        backgroundColor: plan.color,
        borderColor: plan.color,
        allDay: true,
        extendedProps: {
          description: plan.description,
          priority // Include priority in extendedProps
        },
        display: 'block'
      });

      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        timeGridEvents.push({
          id: `daily-${plan.id}-${currentDate.format('YYYY-MM-DD')}`,
          groupId: `group-${plan.id}`,
          title: plan.name,
          icon: plan.nameTouse,
          start: `${currentDate.format('YYYY-MM-DD')}T${plan.start_time}`,
          end: `${currentDate.format('YYYY-MM-DD')}T${plan.end_time}`,
          backgroundColor: plan.color,
          borderColor: plan.color,
          allDay: false,
          icon: plan.nameTouse,
          extendedProps: {
            description: plan.description,
            priority // Include priority in extendedProps
          }
        });
        currentDate.add(1, 'day');
      }
    });

    return { monthViewEvents, timeGridEvents };
  };

  export default processPlans;