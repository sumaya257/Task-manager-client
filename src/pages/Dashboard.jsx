import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null); // To hold the task data for editing

  // Fetch tasks from API
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/added-task");
      return res.json();
    },
  });

  // Edit Task Mutation
  const editTask = useMutation({
    mutationFn: async (task) => {
      const res = await fetch(`http://localhost:5000/added-task/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh tasks after editing
      Swal.fire("Updated!", "Task has been updated.", "success");
      setIsModalOpen(false); // Close modal after success
    },
  });

  // Delete Mutation
  const deleteTask = useMutation({
    mutationFn: async (id) => {
      await fetch(`http://localhost:5000/added-task/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh tasks
      Swal.fire("Deleted!", "Task has been deleted.", "success");
    },
  });

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load tasks.</p>;

  // Categorize tasks
  const categories = ["To-Do", "In Progress", "Done"];
  const categorizedTasks = categories.map((category) => ({
    name: category,
    tasks: tasks.filter((task) => task.category === category),
  }));

  // Open modal and set task to be edited
  const handleEditClick = (task) => {
    setEditedTask(task);
    setIsModalOpen(true);
  };

  // Handle form submission (edit task)
  const handleSubmitEdit = (event) => {
    event.preventDefault();
    const updatedTask = {
      ...editedTask,
      title: event.target.title.value,
      description: event.target.description.value,
      category: event.target.category.value, // Get the category from form input
    };
    editTask.mutate(updatedTask); // Call edit mutation
  };

  return (
    <div>
      {/* Modal for editing task */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-gray-900">
          <div className="modal-content bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold">Edit Task</h2>
            <form onSubmit={handleSubmitEdit}>
              <label className="block mt-4">Title:</label>
              <input
                type="text"
                name="title"
                defaultValue={editedTask?.title}
                className="w-full p-2 mt-2 border rounded"
                required
              />
              <label className="block mt-4">Description:</label>
              <textarea
                name="description"
                defaultValue={editedTask?.description}
                className="w-full p-2 mt-2 border rounded"
                required
              />
              <label className="block mt-4">Category:</label>
              <select
                name="category"
                defaultValue={editedTask?.category}
                className="w-full p-2 mt-2 border rounded bg-gray-800"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-500 px-4 py-2 rounded text-white"
                  onClick={() => setIsModalOpen(false)} // Close the modal
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 px-4 py-2 rounded text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {categorizedTasks.map((category) => (
          <div key={category.name} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">{category.name}</h2>
            {category.tasks.length === 0 ? (
              <p className="text-gray-400">No tasks</p>
            ) : (
              category.tasks.map((task) => (
                <div key={task._id} className="bg-gray-700 p-3 rounded-lg mb-3">
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <p className="text-gray-300">{task.description}</p>
                  <p className="text-gray-400 text-sm">Category: {task.category}</p>
                  <p className="text-gray-400 text-sm">Created: {new Date(task.timestamp).toLocaleString()}</p>
                  <div className="flex justify-between mt-3">
                    <button
                      className="bg-yellow-500 px-3 py-1 rounded text-white"
                      onClick={() => handleEditClick(task)} // Open edit modal
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 px-3 py-1 rounded text-white"
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "This will permanently delete the task.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) deleteTask.mutate(task._id);
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
