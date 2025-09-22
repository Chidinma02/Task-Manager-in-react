import React, { useEffect, useState } from 'react'
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import dayjs from 'dayjs';
interface TodoItem {
    id: number;
    task: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}
const Tasks = () => {


    const [task, setTask] = useState<string>("");
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [isOpen, setIsOpen] = useState(false);


    const filteredTodos = todos.filter(todo => todo.task.toLowerCase().includes(searchTerm.toLowerCase()));

    const fetchTodos = () => {
        axios.get<TodoItem[]>('http://127.0.0.1:8000/api/getall/todos')
            .then(res => setTodos(res.data))
            .catch(err => console.log(err));
    }
    useEffect(() => {
        fetchTodos()
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/todos", { task })
            .then(() => {
                fetchTodos(); // refresh the list from server
                // setTodos([...todos, res.data]); // update local state
                setTask("");
                setIsOpen(false);// reset input
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id: number) => {
        axios.delete(`http://127.0.0.1:8000/api/todos/${id}`)
            .then(() => {
                fetchTodos(); // refresh the list from server

            })
            .catch(err => console.error(err));
    };

    const handleToggle = (id: number, completed: boolean) => {
        axios.put(`http://127.0.0.1:8000/api/todos/${id}`, { completed: !completed })
            .then(() => {
                fetchTodos(); // refresh the list from server

            })
            .catch((err) => console.error(err));
    };

    // const handleDelete = (id) => {
    //     setTodos(todos.filter(todo => todo.id !== id));
    // };

    return (
        <>
            <div className="mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg  lg:pl-70 lg:pr-70 ">
                <h1 className="text-2xl font-bold mb-10  ">
                    Todo App
                </h1>

                <hr className="border-t-2 border-[#F3F3F3]" ></hr>



                <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-5"> + New Task</button>
                {isOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                            <h2 className="text-xl font-semibold mb-4">Add Your Todo</h2>
                            {/* <p className="mb-4">This is a simple modal content.</p> */}


                            <form onSubmit={handleSubmit} className="flex mb-6 mt-5">

                                <input
                                    type="text"
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    placeholder="Enter a task"
                                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </form>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                {/* <button
                                    onClick={() => {
                                        // handle save logic
                                        setIsOpen(false);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button> */}
                            </div>
                        </div>
                    </div>
                )}











                <div className="mt-3 flex">
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="search" className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />

                </div>
                {/* <form onSubmit={handleSubmit} className="flex mb-6 mt-5">

                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Enter a task"
                        className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                        Add
                    </button>
                </form> */}



                {/* Add Task Form */}


                {/* Pending Tasks */}
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Pending</h2>
                <ul className="space-y-2 mb-6">
                    {/* {todos.filter((t) => !t.completed).map((todo) => ( */}
                    {filteredTodos.filter((t) => !t.completed).map((todo) => (
                        <li
                            key={todo.id}
                            className="flex justify-between items-center p-2 py-5 border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                            <div >
                                <span className="font-medium">{todo.task}</span>
                                <div className="mt-4 text-yellow-500  flex items-center gap-2">
                                    <FaRegCalendarAlt className="text-yellow-500" />
                                    <span>{dayjs(todo.created_at).format("DD-MM-YYYY")}</span>

                                </div>
                            </div>

                            <div className="space-x-2">
                                <button
                                    onClick={() => handleToggle(todo.id, todo.completed)}
                                    className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                >
                                    Complete
                                </button>
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Completed Tasks */}
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Completed</h2>
                <ul className="space-y-2">
                    {/* {todos.filter((t) => t.completed).map((todo) => ( */}
                    {filteredTodos.filter((t) => t.completed).map((todo) => (

                        <li
                            key={todo.id}
                            className="flex justify-between items-center p-2 py-5 border border-gray-200 rounded-lg p-4 shadow-sm bg-green-100 rounded"
                        >
                            <span className="line-through text-gray-600">{todo.task}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleToggle(todo.id, todo.completed)}
                                    className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                                >
                                    Undo
                                </button>
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </>



    )
}

export default Tasks