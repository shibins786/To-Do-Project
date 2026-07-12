import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Tasks(){

 // Stores all tasks received from Django.
// Initially the array is empty because we haven't fetched any tasks yet
const [tasks,setTasks] = useState([]);

// Stores the title entered by the user while creating a new task.
const [title,setTitle] = useState('');

// Stores the description entered by the user.
const [description,setDescription] = useState('');

// Stores the id of the task currently being edited.
// null means we are creating a new task.
const [editId, setEditId] = useState(null);



// Used to move the user to another page.
const navigate = useNavigate();

 // Runs only once when the Tasks page is opened.
// [] means "Run only when the component is mounted."
useEffect(()=>{

    // Call our function to get all tasks
    getTasks();
},[])

async function getTasks() {
    try {
        // Read the access token from browser storage.
        const token = localStorage.getItem("access");
        // Send GET request to Django.
        const response = await api.get("tasks/",{
            headers :{
                Authorization :`Bearer ${token}`
            }
        });
        // Save all tasks into React state.
        setTasks(response.data);

    } catch (error) {
        console.log(error);

        // Token invalid or expired.
        navigate("/login")

    }
}

// This function runs when the user clicks the "Add Task" button.
async function addTask() {

    try {

        const token = localStorage.getItem("access");

        // If editId has a value, update the task.
        if (editId !== null) {

            const response = await api.put(`tasks/${editId}/`,
                {
                    title,
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the task in React state.
            setTasks(
                tasks.map((task) =>
                    task.id === editId ? response.data : task
                )
            );

            // Return to Add Mode.
            setEditId(null);

        } else {

            // Create a new task.
            const response = await api.post(
                "tasks/",
                {
                    title,
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Add the new task to the list.
            setTasks([...tasks, response.data]);

        }

        // Clear the input fields.
        setTitle("");
        setDescription("");

    } catch (error) {

        console.log(error);

    }

}

// Runs when the Edit button is clicked.
function editTask(task){

   // Fill the input fields with the selected task.
    setTitle(task.title);

     // Fill the textarea with the selected task description.
    setDescription(task.description);

    // Remember which task is being edited.
    setEditId(task.id);

}

// Runs when the user clicks the Delete button.
async function deleteTask(id) {

    try {

        // Read the access token from localStorage.
        const token = localStorage.getItem("access");

        // Send DELETE request to Django.
        await api.delete(
            `tasks/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Remove the deleted task from React state.
        setTasks(
            tasks.filter((task) => task.id !== id)
        );
        // Keep every task except the one whose id matches the deleted task.

    } catch (error) {

        console.log(error);

    }

}

// Runs when the Logout button is clicked.
async function logout() {

    try {

        // Read the refresh token from localStorage.
        const refresh = localStorage.getItem("refresh");

        // Send the refresh token to Django.
        await api.post(
            "logout/",
            {
                refresh: refresh,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            }
        );

    } catch (error) {

        console.log(error);

    }

    // Remove both tokens from the browser.
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Go back to the Login page.
    navigate("/login");
}
return(
   <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-6 flex justify-end">

    <button
        onClick={logout}
        className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
    >
        Logout
    </button>

</div>
            {/* Page Heading */}
            <h1 className="mb-8 text-center text-4xl font-bold">
                My Tasks
            </h1>

            {/* Task Input Card */}
            <div className="mx-auto mb-8 max-w-2xl rounded-xl bg-white p-6 shadow">

                <input
                    type="text"
                    placeholder="Task Title"
                    className="mb-4 w-full rounded border p-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Task Description"
                    className="mb-4 w-full rounded border p-3"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button
                    className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    onClick={addTask}//If your function needs extra data (like task.id), use an arrow function. If it doesn't need extra data, pass the function directly.
                >
                    {editId !== null ? "Update Task" : "Add Task"}
                </button>

            </div>

            {/* Task List */}
            <div className="mx-auto max-w-2xl space-y-4">

                {tasks.length === 0 ? (

                    <div className="rounded bg-white p-6 text-center shadow">
                        No Tasks Available
                    </div>

                ) : (

                    tasks.map((task) => (

                        <div
                            key={task.id}
                            className="rounded-xl bg-white p-5 shadow"
                        >

                            <h2 className="text-2xl font-bold">
                                {task.title}
                            </h2>

                            <p className="mt-2 text-gray-600">
                                {task.description}
                            </p>

                            <div className="mt-4 flex gap-3">

                                <button
                                    className="rounded bg-yellow-500 px-4 py-2 text-white"
                                onClick={()=>editTask(task)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="rounded bg-red-600 px-4 py-2 text-white"
                                    onClick={()=>deleteTask(task.id)}
                                    //arrow function -we want deleteTask() to run only when the button is clicked, not when the page loads.
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

);
}