import React, { useEffect, useState } from 'react'
import axios from "axios";

interface TodoItem {
    id: number;
    task: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}
const Todo = () => {

    const [task, setTask] = useState<string>("");
    const [todos, setTodos] = useState<TodoItem[]>([]);


    useEffect(() => {
        axios.get<TodoItem[]>('http://127.0.0.1:8000/api/getall/todos')
            .then(res => setTodos(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/todos", { task })
            .then(res => {
                setTodos([...todos, res.data]); // update local state
                setTask(""); // reset input
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id: number) => {
        axios.delete(`http://127.0.0.1:8000/api/todos/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch(err => console.error(err));
    };

    const handleToggle = (id: number, completed: boolean) => {
        axios.put(`http://127.0.0.1:8000/api/todos/${id}`, { completed: !completed })
            .then(() => {
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                ));
            })
            .catch((err) => console.error(err));
    };

    // const handleDelete = (id) => {
    //     setTodos(todos.filter(todo => todo.id !== id));
    // };

    return (
        <>
            <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Todo App
                </h1>

                {/* Add Task Form */}
                <form onSubmit={handleSubmit} className="flex mb-6">
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

                {/* Pending Tasks */}
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Pending</h2>
                <ul className="space-y-2 mb-6">
                    {todos.filter((t) => !t.completed).map((todo) => (
                        <li
                            key={todo.id}
                            className="flex justify-between items-center p-2 bg-gray-100 rounded"
                        >
                            <span>{todo.task}</span>
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
                    {todos.filter((t) => t.completed).map((todo) => (
                        <li
                            key={todo.id}
                            className="flex justify-between items-center p-2 bg-green-100 rounded"
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

export default Todo