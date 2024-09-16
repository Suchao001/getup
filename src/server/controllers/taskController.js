import knex from '../config.js';

const getTasks = async (req, res) => {
    try {
      const userId = req.user.id;
      const tasks = await knex('tasks').join('icons', 'icons.id', '=', 'tasks.icon_id')
        .where({ user_id: userId }).select('tasks.id', 'tasks.user_id', 'tasks.name', 'tasks.icon_id', 'tasks.color', 'tasks.deadline', 'tasks.priority', 'tasks.point', 'tasks.is_complete', 'icons.nameTouse');
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  
  const createTask = async (req, res) => {
    const { name, icon, color, deadline, priority, point } = req.body;
    const userId = req.user.id;
    let _deadline = null;
    if(deadline === ''){
      _deadline = null;
    }

    if (!name) {
      return res.status(400).send('Name is required');
    }
    
    try {
      const [taskId] = await knex('tasks')
        .insert({
          name,
          icon_id: icon,
          color,
          deadline: _deadline,
          priority,
          point,
          user_id: userId,
        })
        .returning('id');
  
      res.status(201).json({ message: 'Task created successfully', taskId });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  const updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, icon_id, color, deadline, priority, point } = req.body;
    const userId = req.user.id;
  
    try {
      // Convert the ISO string to a MySQL compatible datetime format
      const formattedDeadline = deadline ? new Date(deadline).toISOString().slice(0, 19).replace('T', ' ') : null;

      const updatedRows = await knex('tasks')
        .where({ id, user_id: userId })
        .update({
          name,
          icon_id,
          color,
          deadline: formattedDeadline,
          priority,
          point,
        });
  
      if (!updatedRows) {
        return res.status(404).send('Task not found');
      }
  
      res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  const checkTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
      const task = await knex('tasks')
        .where({ id, user_id: userId })
        .first();
      if (!task) {
        return res.status(404).send('Task not found');
      }
      const updatedRows = await knex('tasks')
        .where({ id, user_id: userId })
        .update({ is_complete: !task.is_complete });
      res.status(200).json({ message: 'Task updated successfully', is_complete: !task.is_complete });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  
  const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      const deletedRows = await knex('tasks')
        .where({ id, user_id: userId })
        .del();
  
      if (!deletedRows) {
        return res.status(404).send('Task not found');
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  export { getTasks, createTask, updateTask, deleteTask, checkTask };
