import knex from '../config.js';

const getPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    //  const userId = 2;
     const plans = await knex('plan')
     .join('icons', 'icons.id', '=', 'plan.icon_id')
     .select(
       'plan.id',
       'plan.user_id',
       'plan.name',
       'plan.description',
       'plan.icon_id',
       'plan.color',
       knex.raw("DATE_FORMAT(plan.start_date, '%Y-%m-%d') as start_date"),
       knex.raw("DATE_FORMAT(plan.end_date, '%Y-%m-%d') as end_date"),
       'plan.start_time',
       'plan.end_time',
       'plan.priority',
       'icons.nameTouse'
     )
     .where({ 'plan.user_id': userId });
   
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPlansById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const plans = await knex('plan')
      .join('icons', 'icons.id', '=', 'plan.icon_id')
      .select(
        'plan.id',
        'plan.user_id',
        'plan.name',
        'plan.description',
        'plan.icon_id',
        'plan.color',
        knex.raw("DATE_FORMAT(plan.start_date, '%Y-%m-%d') as start_date"),
        knex.raw("DATE_FORMAT(plan.end_date, '%Y-%m-%d') as end_date"),
        'plan.start_time',
        'plan.end_time',
        'plan.priority',
        'icons.nameTouse'
      )
      .where({ 'plan.user_id': userId, 'plan.id': id });
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    res.status(200).json(plans[0]);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPlansByDate = async (req, res) => {
  const { date } = req.params;
  const userId = req.user.id;

  try {
    const plans = await knex('plan')
      .join('icons', 'icons.id', '=', 'plan.icon_id')
      .select(
        'plan.id',
        'plan.user_id',
        'plan.name',
        'plan.description',
        'plan.icon_id',
        'plan.color',
        knex.raw("DATE_FORMAT(plan.start_date, '%Y-%m-%d') as start_date"),
        knex.raw("DATE_FORMAT(plan.end_date, '%Y-%m-%d') as end_date"),
        'plan.start_time',
        'plan.end_time',
        'plan.priority',
        'icons.nameTouse'
      )
      .where({ 'plan.user_id': userId })
      .andWhere(function() {
        this.where('plan.start_date', '<=', date)
          .andWhere('plan.end_date', '>=', date);
      });

    if (plans.length === 0) {
      return res.status(404).json({ message: 'No plans found for the specified date' });
    }
    
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).send(error.message);
  }
};



const createPlan = async (req, res) => {
  const { name, description, icon_id, color, start_date, end_date, start_time, end_time, priority } = req.body;
  const userId = req.user.id;
  const today = new Date();

  if (!name) {
    return res.status(400).send('Name is required');
  }

  try {
    const [planId] = await knex('plan')
      .insert({
        name,
        description: description || null,
        icon_id: icon_id || 3,
        color: color || "#1677ff",
        start_date: start_date ,
        end_date: end_date ||start_date,
        start_time: start_time ||null,
        end_time: end_time||null,
        priority: priority || 3,
        user_id: userId,
      })
      .returning('id');

    res.status(201).json({ message: 'Plan created successfully', planId });
  } catch (error) {
    res.status(400).send(`Error creating plan: ${error.message}`);
  }
};




const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, color, start_date, end_date, start_time, end_time, priority } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!name) {
    return res.status(400).send('Name is required');
  }

  try {
    const updatedRows = await knex('plan')
      .where({ id, user_id: userId })
      .update({
        name,
        description: description || null,
        icon_id: icon || 3,
        color: color || "#1677ff",
        start_date: start_date || new Date().toISOString().split('T')[0],
        end_date: end_date || new Date().toISOString().split('T')[0],
        start_time: start_time || '00:00:00',
        end_time: end_time || '00:00:00',
        priority: priority || 3,
      });

    if (updatedRows === 0) {
      return res.status(404).send('Plan not found or no changes made');
    }

    res.status(200).json({ message: 'Plan updated successfully' });
  } catch (error) {
    res.status(400).send(`Error updating plan: ${error.message}`);
  }
};

const deletePlan = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedRows = await knex('plan')
      .where({ id, user_id: userId })
      .del();

    if (!deletedRows) {
      return res.status(404).send('Plan not found');
    }

    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export { getPlans, createPlan, updatePlan, deletePlan, getPlansByDate,getPlansById };
