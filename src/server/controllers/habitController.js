import knex from '../config.js';

const getHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const habits = await knex('habits')
      .leftJoin('icons', 'habits.icon_id', 'icons.id')
      .select('habits.*', 'icons.nameTouse')
      .where({ 'habits.user_id': userId });

    const habitIds = habits.map(habit => habit.id);

    const habitDays = await knex('habit_days')
      .whereIn('habit_id', habitIds);

    const habitDates = await knex('habit_dates')
      .whereIn('habit_id', habitIds);

    const habitDaysMap = habitDays.reduce((acc, habitDay) => {
      acc[habitDay.habit_id] = JSON.parse(habitDay.day);
      return acc;
    }, {});

    const habitDatesMap = habitDates.reduce((acc, habitDate) => {
      acc[habitDate.habit_id] = JSON.parse(habitDate.dates);
      return acc;
    }, {});

    for (const habit of habits) {
      habit.days = habitDaysMap[habit.id] || [];
      habit.dates = habitDatesMap[habit.id] || [];
    }

    res.status(200).json(habits);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getHabitsByDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { day } = req.params;

    // Parse the day parameter
    const date = new Date(day);
    const dayOfMonth = date.getDate(); // Day of the month
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); // Day of the week

    const habits = await knex('habits')
      .leftJoin('icons', 'habits.icon_id', 'icons.id')
      .select('habits.*', 'icons.nameTouse')
      .where({ 'habits.user_id': userId });

    const habitIds = habits.map(habit => habit.id);

    const habitDays = await knex('habit_days')
      .whereIn('habit_id', habitIds);

    const habitDates = await knex('habit_dates')
      .whereIn('habit_id', habitIds);

    const habitDaysMap = habitDays.reduce((acc, habitDay) => {
      acc[habitDay.habit_id] = JSON.parse(habitDay.day);
      return acc;
    }, {});

    const habitDatesMap = habitDates.reduce((acc, habitDate) => {
      acc[habitDate.habit_id] = JSON.parse(habitDate.dates);
      return acc;
    }, {});

    const filteredHabits = habits.filter(habit => {
      const days = habitDaysMap[habit.id] || [];
      const dates = habitDatesMap[habit.id] || [];

      if (habit.frequency === 'daily') {
        return true;
      } else if (habit.frequency === 'weekly' && days.includes(dayOfWeek)) {
        return true;
      } else if (habit.frequency === 'monthly' && dates.includes(dayOfMonth)) {
        return true;
      }
      return false;
    });

    res.status(200).json(filteredHabits);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const createHabit = async (req, res) => {
  const { name, icon_id, color, frequency, days, dates,time_of_day } = req.body;
  const userId = req.user.id;
  if (!name || !frequency) {
    return res.status(400).send('Name and frequency are required');
  }
  try {
    const [habitId] = await knex('habits')
      .insert({
        name,
        icon_id,
        color,
        frequency,
        user_id: userId,
        time_of_day
      })
      .returning('id');

    if (frequency === 'weekly' && days && days.length > 0) {
      await knex('habit_days').insert({
        habit_id: habitId,
        day: JSON.stringify(days),
      });
    }

    if (frequency === 'monthly' && dates && dates.length > 0) {
      await knex('habit_dates').insert({
        habit_id: habitId,
        dates: JSON.stringify(dates),
      });
    }

    res.status(201).json({ message: 'Habit created successfully', habitId ,});
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(400).send(error.message);
  }
};


const updateHabit = async (req, res) => {
  const { id } = req.params;
  const { name, icon, color, frequency, days, details, dates,time_of_day } = req.body;
  const userId = req.user.id;

  try {
    const updatedRows = await knex('habits')
      .where({ id, user_id: userId })
      .update({
        name,
        icon,
        color,
        frequency,
        details,
        time_of_day
      });

    if (!updatedRows) {
      return res.status(404).send('Habit not found');
    }
    switch (frequency) {
      case 'weekly':
        if (days && days.length > 0) {
          await knex('habit_days').where({ habit_id: id }).del();
          const habitDays = days.map(day => ({ habit_id: id, day }));
          await knex('habit_days').insert(habitDays);
        } else {
          // Delete existing habit_days if frequency changed from weekly
          await knex('habit_days').where({ habit_id: id }).del();
        }
        break;
      case 'monthly':
        if (dates) {
          const dateArray = JSON.parse(dates);
          if (!Array.isArray(dateArray) || !dateArray.every(date => date >= 1 && date <= 31)) {
            return res.status(400).send('Invalid dates array');
          }
          await knex('habit_dates')
            .where({ habit_id: id })
            .update({ dates: JSON.stringify(dateArray) });
        } else {
          await knex('habit_dates').where({ habit_id: id }).del();
        }
        break;
    }

    res.status(200).json({ message: 'Habit updated successfully' });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteHabit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedRows = await knex('habits')
      .where({ id, user_id: userId })
      .del();

    if (!deletedRows) {
      return res.status(404).send('Habit not found');
    }

    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const insertHistory = async (req, res) => {
  // const { id } = req.params;
  // const userId = req.user.id;

  // try {
  //   const insert = await knex('habit_history')
  //     .insert({habit_id: id});

  //   if (!insert) {
  //     return res.status(404).send('Habit not found');
  //   }

  //   res.status(200).json({ message: 'Habit  successfully' });
  // } catch (error) {
  //   res.status(400).send(error.message);
  // }
}

export { getHabits, createHabit, updateHabit, deleteHabit,getHabitsByDay,insertHistory };
