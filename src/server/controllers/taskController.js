import knex from '../config.js';

const getTasks = async (req, res) => {
    try {
      const userId = req.user.id;
      const tasks = await knex('tasks')
        .where({ user_id: userId });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  
  const createTask = async (req, res) => {
    const { name, icon, color, deadline, priority, point } = req.body;
    const userId = req.user.id;
    if (!name) {
      return res.status(400).send('Name is required');
    }
  
    try {
      const [taskId] = await knex('tasks')
        .insert({
          name,
          icon_id: icon,
          color,
          deadline,
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
    const { name, icon, color, deadline, priority, point } = req.body;
    const userId = req.user.id;
  
    try {
      const updatedRows = await knex('tasks')
        .where({ id, user_id: userId })
        .update({
          name,
          icon_id: icon,
          color,
          deadline,
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

  export { getTasks, createTask, updateTask, deleteTask };
