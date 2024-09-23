import knex from '../config.js';

const getRecommendCategory = async (req, res) => {
    try {
        const habits = await knex('habit_category')
            .select(
                'habit_category.id',
                'habit_category.name',
                'habit_category.color'
            );
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecommend = async (req, res) => {
    try {
        const habits = await knex('habit_recommendation')
            .join('habit_category', 'habit_recommendation.category_id', '=', 'habit_category.id')
            .join('icons', 'habit_recommendation.icon_id', '=', 'icons.id')
            .select(
                'habit_recommendation.id',
                'habit_recommendation.name',
                'habit_recommendation.icon_id',
                'habit_category.color',
                'habit_category.name as category_name',
                'icons.name as icon_name'
            );
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecommendHabit = async (req, res) => {
    try {
        const habits = await knex('habit_recommendation').join('icons', 'habit_recommendation.icon_id', '=', 'icons.id').join('habit_category', 'habit_recommendation.category_id', '=', 'habit_category.id')
            .where('habit_recommendation.category_id', req.params.id)
            .select(
                'habit_recommendation.name',
                'habit_recommendation.icon_id',
                'icons.nameTouse as nameToUse',
                'icons.id as icon_id',
                'habit_category.color'
            );
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getRecommendCategory,
    getRecommendHabit
};

