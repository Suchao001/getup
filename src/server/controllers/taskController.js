import knex from '../config.js';

const getTasks = async (req, res) => {
    try {
      const userId = req.user.id;
      const tasks = await knex('tasks')
        .join('icons', 'icons.id', '=', 'tasks.icon_id')
        .where({ 'tasks.user_id': userId })
        .select(
          'tasks.id',
          'tasks.user_id',
          'tasks.name',
          'tasks.icon_id',
          'tasks.color',
          'tasks.deadline',
          'tasks.priority',
          'tasks.point',
          'tasks.is_complete',
          'icons.nameTouse'
        );

      // Fetch task_list for each task
      for (let task of tasks) {
        const taskLists = await knex('task_list')
          .where({ task_id: task.id })
          .select('list_name');
        task.task_list = taskLists.map(tl => tl.list_name);
      }

      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  
  const createTask = async (req, res) => {
    const { name, icon_id, color, deadline, priority, point, task_list } = req.body;
    const userId = req.user.id;
    let _deadline = deadline;
    if (deadline === '') {
      _deadline = null;
    } else if (deadline) {
      _deadline = new Date(deadline).toISOString().slice(0, 19).replace('T', ' ');
    }

    if (!name) {
      return res.status(400).send('Name is required');
    }
    
    try {
      const [taskId] = await knex('tasks')
        .insert({
          name,
          icon_id,
          color,
          deadline: _deadline,
          priority,
          point,
          user_id: userId,
        })
        .returning('id');
        
      if (task_list && task_list.length > 0) {
        const taskListEntries = task_list.map(listName => ({
          task_id: taskId,
          list_name: listName
        }));
        
        await knex('task_list').insert(taskListEntries);
      }
  
      res.status(201).json({ message: 'Task created successfully', taskId });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  const updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, icon_id, color, deadline, priority, point, task_list } = req.body;
    const userId = req.user.id;

    try {
      // Start a transaction
      await knex.transaction(async (trx) => {
        // Convert the ISO string to a MySQL compatible datetime format
        const formattedDeadline = deadline ? new Date(deadline).toISOString().slice(0, 19).replace('T', ' ') : null;

        // Update the task
        const updatedRows = await trx('tasks')
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
          throw new Error('Task not found');
        }

        // Delete existing task_list entries for this task
        await trx('task_list').where({ task_id: id }).del();

        // Insert new task_list entries
        if (task_list && task_list.length > 0) {
          const taskListEntries = task_list.map(listName => ({
            task_id: id,
            list_name: listName
          }));
          
          await trx('task_list').insert(taskListEntries);
        }
      });

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
