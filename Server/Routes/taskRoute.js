//Task Routes

const express = require('express')
const Task = require('../Models/Task')
const router = express.Router()

//Create a new Task

router.post('/tasks', async (req, res) => {
  try {
    const { title, dueDate } = req.body
    const newTask = new Task({ title, dueDate })
    await newTask.save()
    res.status(201).json(newTask)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

//get all tasks

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//get Task by id

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.status(200).json(task)
  } catch (error) {
    res.send(500).json({ error: error.message })
  }
})

//Update a task by ID

router.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.send(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//delte a task by Id

router.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not foudn' })
    }

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
