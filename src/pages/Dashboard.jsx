/* eslint-disable react/prop-types */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { isMobile } from "react-device-detect"; // Detect mobile devices
import { TouchBackend } from "react-dnd-touch-backend";
import { useAuth } from "../provider/AuthProvider";

const ItemType = "TASK"; // item-type

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth()
  console.log(user?.email)

  // Fetch tasks from API
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks", user?.email], 
    queryFn: async () => {
    const res = await fetch(`https://task-manager-server-psi-red.vercel.app/added-task?email=${user?.email}`);
    return res.json();
  },
  enabled: !!user?.email, // Only fetch when email exists
  });

  // Edit Task Mutation
  const editTask = useMutation({
    mutationFn: async (task) => {
      const res = await fetch(`https://task-manager-server-psi-red.vercel.app/added-task/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire("Updated!", "Task has been updated.", "success");
      setIsModalOpen(false);
    },
  });

  // Delete Mutation
  const deleteTask = useMutation({
    mutationFn: async (id) => {
      await fetch(`https://task-manager-server-psi-red.vercel.app/added-task/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire("Deleted!", "Task has been deleted.", "success");
    },
  });

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load tasks.</p>;

  const categories = ["To-Do", "In Progress", "Done"];
  const categorizedTasks = categories.map((category) => ({
    name: category,
    tasks: tasks.filter((task) => task.category === category),
  }));

  // Drag and Drop Components
  const Task = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemType,
      item: task,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`bg-gray-700 p-3 rounded-lg mb-3 cursor-pointer ${isDragging ? "opacity-50" : ""}`}
      >
        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        <p className="text-gray-300">{task.description}</p>
        <p className="text-gray-400 text-sm">Category: {task.category}</p>
        <p className={`text-sm font-bold ${new Date(task.dueDate) < new Date() ? "text-red-500" : "text-gray-300"}`}>
        {task.dueDate}
        </p>

        <div className="flex justify-between mt-3">
          <button
            className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-600 transition text-white font-semibold shadow-lg"
            onClick={() => {
              setEditedTask(task);
              setIsModalOpen(true);
            }}
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
    );
  };

  const CategoryColumn = ({ name, tasks }) => {
    const [, drop] = useDrop({
      accept: ItemType,
      drop: (draggedTask) => {
        if (draggedTask.category !== name) {
          editTask.mutate({ ...draggedTask, category: name });
        }
      },
    });

    return (
      <div ref={drop} className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[200px]">
        <h2 className="text-xl font-bold text-white mb-4">{name}</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks</p>
        ) : (
          tasks.map((task) => <Task key={task._id} task={task} />)
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div>
        {/* Modal for editing task */}
        {isModalOpen && (
          <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-75">
            <div className="modal-content bg-gray-800 p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold">Edit Task</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  editTask.mutate({
                    ...editedTask,
                    title: event.target.title.value,
                    description: event.target.description.value,
                    category: event.target.category.value,
                  });
                }}
              >
                <label className="block mt-4">Title:</label>
                <input type="text" name="title" defaultValue={editedTask?.title} className="w-full p-2 mt-2 border rounded" required />
                <label className="block mt-4">Description:</label>
                <textarea name="description" defaultValue={editedTask?.description} className="w-full p-2 mt-2 border rounded" required />
                <label className="block mt-4">Category:</label>
                <select name="category" defaultValue={editedTask?.category} className="w-full p-2 mt-2 border rounded bg-gray-800">
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="flex justify-between mt-4">
                  <button type="button" className="bg-gray-500 px-4 py-2 rounded text-white" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-600 transition text-white font-semibold shadow-lg">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Categories */}
        <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {categorizedTasks.map((category) => (
            <CategoryColumn key={category.name} name={category.name} tasks={category.tasks} />
          ))}
        </div>

        {/* Add Task Button */}
        <div className="flex justify-center mb-4">
          <button onClick={() => navigate("/add-task")} className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition text-white font-semibold shadow-lg text-lg">
            + Add Task
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
