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
    const dayOfMonth = date.getDate();
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

    const habits = await knex('habits')
      .leftJoin('icons', 'habits.icon_id', 'icons.id')
      .leftJoin('habit_days', 'habits.id', 'habit_days.habit_id')
      .leftJoin('habit_dates', 'habits.id', 'habit_dates.habit_id')
      .select(
        'habits.*',
        'icons.nameTouse',
        knex.raw('JSON_UNQUOTE(habit_days.day) as days'),
        knex.raw('JSON_UNQUOTE(habit_dates.dates) as dates')
      )
      .where({ 'habits.user_id': userId })
      .where(function() {
        this.where('habits.frequency', 'daily')
          .orWhere(function() {
            this.where('habits.frequency', 'weekly')
              .whereRaw('JSON_CONTAINS(habit_days.day, ?)', [JSON.stringify(dayOfWeek)])
          })
          .orWhere(function() {
            this.where('habits.frequency', 'monthly')
              .whereRaw('JSON_CONTAINS(habit_dates.dates, ?)', [JSON.stringify(dayOfMonth)])
          })
      });

    res.status(200).json(habits);
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
  const { name, icon_id, color, frequency, days, details, dates,time_of_day } = req.body;
  const userId = req.user.id;

  try {
    const updatedRows = await knex('habits')
      .where({ id, user_id: userId })
      .update({
        name,
        icon_id,
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
        if (days) {
          await knex('habit_days').where({ habit_id: id }).update({ day: JSON.stringify(days) });
        } else {
          return res.status(400).send('Days are required');
        }
        break;
      case 'monthly':
        if (dates) {
          await knex('habit_dates')
            .where({ habit_id: id })
            .update({ dates: JSON.stringify(dates) });
        } else {
          return res.status(400).send('Dates are required');
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

const toggleComplete = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const habit = await knex('habits').where({ id, user_id: userId }).first();
    if (!habit) {
      return res.status(404).send('Habit not found');
    }

    const existingEntry = await knex('habit_history')
      .where({ habit_id: id })
      .whereRaw('DATE(complete_at) = CURDATE()')
      .first();

    if (existingEntry) {
      await knex('habit_history')
        .where({ id: existingEntry.id })
        .del();
      res.status(200).json({ message: 'Habit completion removed for today' });
    } else {
      await knex('habit_history').insert({
        habit_id: id,
        complete_at: knex.fn.now()
      });
      res.status(200).json({ message: 'Habit marked as completed for today' });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const checkCompleted = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const habit = await knex('habits').where({ id, user_id: userId }).first();
    if (!habit) {
      return res.status(404).send('Habit not found');
    }

    const existingEntry = await knex('habit_history')
      .where({ habit_id: id })
      .whereRaw('DATE(complete_at) = CURDATE()')
      .first();

    if (existingEntry) {
      res.status(200).json({ completed: true });
    } else {
      res.status(200).json({ completed: false });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export { getHabits, createHabit, updateHabit, deleteHabit,getHabitsByDay, toggleComplete, checkCompleted };
