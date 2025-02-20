import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const Dashboard = () => {
  const queryClient = useQueryClient();

  // Fetch tasks from API
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/added-task");
      return res.json();
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

  return (
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
                <div className="flex justify-between mt-3">
                  <button
                    className="bg-yellow-500 px-3 py-1 rounded text-white"
                    onClick={() => Swal.fire("Edit Clicked", `Editing ${task.title}`, "info")}
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
  );
};

export default Dashboard;
