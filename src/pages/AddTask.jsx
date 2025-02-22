import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../provider/AuthProvider";

const AddTask = () => {
   const {user} = useAuth()
   const [task, setTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
    dueDate: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });

    // Clear error when user types
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!task.title.trim()) newErrors.title = "Title is required.";
    if (task.title.length > 50) newErrors.title = "Title must be under 50 characters.";
    if (task.description.length > 200) newErrors.description = "Description must be under 200 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const newTask = {
      title: task.title.trim(),
      description: task.description.trim(),
      category: task.category,
      dueDate: task.dueDate,
      timestamp: new Date().toISOString(),
      userEmail: user?.email

    };

    try {
      const response = await fetch("https://task-manager-server-psi-red.vercel.app/added-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setTask({ title: "", description: "", category: "To-Do" }); // Reset form
        Swal.fire("Success", "Task added successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to add task", "error");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Add a New Task</h2>

        {/* Title Input */}
        <label className="block mb-2 text-white">Title:</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white"
          placeholder="Enter task title"
          maxLength="50"
        />
        {errors.title && <p className="text-red-500 text-sm mb-3">{errors.title}</p>}

        {/* Description Input */}
        <label className="block mb-2 text-white">Description:</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white"
          placeholder="Enter task description"
          maxLength="200"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mb-3">{errors.description}</p>}

        {/* Category Selection */}
        <label className="block mb-2 text-white">Category:</label>
        <select
          name="category"
          value={task.category}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4 bg-gray-700 text-white"
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        {/* Due Date Input */}
    <label className="block mb-2 text-white">Due Date:</label>
    <input
      type="datetime-local"
      name="dueDate"
      value={task.dueDate}
      onChange={handleChange}
      className="w-full p-2 border rounded mb-4 bg-gray-700 text-white"
    />
    {errors.dueDate && <p className="text-red-500 text-sm mb-3">{errors.dueDate}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className={`px-6 py-3 rounded-lg font-semibold shadow-lg w-full ${
            isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
