import Task from "../Model/ToDoModel.js";

export const getAllTodos = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized. User ID missing.' });
    }

    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, dueDate, deadline, repeatEnabled, repeatType, reminderTime, timePreference } = req.body;
    console.log('create todo');
    const userId = req.user._id;
    
    // Validation
    if (!title || !dueDate) {
      return res.status(400).json({ success: false, error: 'Title and due date are required.' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Unauthorized. User ID missing.' });
    }

    const taskData = {
      title,
      dueDate,
      user: userId,
      status: 'open',
      completed: false
    };

    // Add optional fields if provided
    if (deadline) taskData.deadline = deadline;
    if (repeatEnabled !== undefined) taskData.repeatEnabled = repeatEnabled;
    if (repeatType) taskData.repeatType = repeatType;
    if (reminderTime) taskData.reminderTime = reminderTime;
    if (timePreference) taskData.timePreference = timePreference;

    const newTask = new Task(taskData);
    await newTask.save();
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { title, dueDate, completed, status, deadline, repeatEnabled, repeatType, reminderTime, timePreference } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (completed !== undefined) {
      updateFields.completed = completed;
      // Auto-update status based on completed state
      updateFields.status = completed ? 'closed' : 'open';
    }
    if (status !== undefined) {
      updateFields.status = status;
      // Auto-update completed based on status
      updateFields.completed = status === 'closed';
    }
    if (deadline !== undefined) updateFields.deadline = deadline;
    if (repeatEnabled !== undefined) updateFields.repeatEnabled = repeatEnabled;
    if (repeatType !== undefined) updateFields.repeatType = repeatType;
    if (reminderTime !== undefined) updateFields.reminderTime = reminderTime;
    if (timePreference !== undefined) updateFields.timePreference = timePreference;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// New endpoint to handle daily habit recreation
export const recreateDailyHabits = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Recreating daily habits for user:', userId); // debug log

    // Find all repeat-enabled tasks that are completed
    const completedHabits = await Task.find({
      user: userId,
      repeatEnabled: true,
      status: 'closed',
      repeatType: 'daily'
    });

    console.log('Found completed habits:', completedHabits.length); //debug log

    const newTasks = [];
    for (const habit of completedHabits) {
      //Only check for OPEN tasks created today
      const existingTodayTask = await Task.findOne({
        user: userId,
        title: habit.title,
        repeatEnabled: true,
        status: 'open', //only check open tasks
        createdAt: { $gte: today }
      });

      console.log(`Checking habit "${habit.title}":`, existingTodayTask ? 'exists' : 'creating new');

      if (!existingTodayTask) {
        // Create new task for today
        const newTask = new Task({
          title: habit.title,
          dueDate: new Date(),
          deadline: habit.deadline,
          repeatEnabled: true,
          repeatType: habit.repeatType,
          reminderTime: habit.reminderTime,
          timePreference: habit.timePreference,
          user: userId,
          status: 'open',
          completed: false
        });
        await newTask.save();
        newTasks.push(newTask);
        console.log(`✅ Created new habit: ${habit.title}`);
      }
    }

    console.log(`Created ${newTasks.length} daily habits`);

    res.status(200).json({ 
      success: true, 
      message: `Created ${newTasks.length} daily habits`,
      data: newTasks 
    });
  } catch (error) {
    console.error('Error in recreateDailyHabits:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
