import knex from '../config.js';

const getHabitHistory = async (req, res) => {
    try {
         const userId = req.user.id;
        // const userId = 2;
        const habits = await knex('habit_history').join('habits', 'habit_history.habit_id', '=', 'habits.id').join('icons', 'habits.icon_id', '=', 'icons.id')
        .where({ user_id: userId })
        .select('habit_history.id','habits.id','habit_history.complete_at','habits.name','habits.color','icons.nameTouse','habits.time_of_day','habits.details','habits.created_at');
        const habitsById = habits.reduce((acc, habit) => {
            if (!acc[habit.id]) {
                acc[habit.id] = { ...habit, complete_at: [habit.complete_at] };
            } else {
                acc[habit.id].complete_at.push(habit.complete_at);
            }
            return acc;
        }, {});
        res.status(200).json(habitsById);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getHabitCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const habits = await knex('habit_history').join('habits', 'habit_history.habit_id', '=', 'habits.id')
        .where({ user_id: userId })
        .select(knex.raw('COUNT(*) as count'));
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    getHabitHistory,
    getHabitCount
}