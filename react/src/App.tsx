import { useCallback, useMemo, useState } from "react";

type Status = "NEW" | "DONE";
type Todo = {
  id: string;
  title: string;
  duedate: string;
  status: Status;
};
type Filter = "ALL" | Status;

const initialTodo: Todo = {
  id: "",
  title: "",
  duedate: "",
  status: "NEW",
};

function App() {
  const [todo, setTodo] = useState<Todo>(initialTodo);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "ALL":
        return todos;
      case "NEW":
        return todos.filter((todo) => todo.status === "NEW");
      case "DONE":
        return todos.filter((todo) => todo.status === "DONE");
    }
  }, [filter, todos]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const generateId = () => Math.random().toString(32).substring(2);
      setTodos((prev) => [...prev, { ...todo, id: generateId() }]);
      setTodo(initialTodo);
    },
    [todo]
  );

  const handleChangeFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as Filter);
  }, []);

  const handleChangeStatus = useCallback((todo: Todo, e: React.ChangeEvent<HTMLInputElement>) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === todo.id
          ? {
              ...item,
              status: e.target.checked ? "DONE" : "NEW",
            }
          : item
      )
    );
  }, []);

  console.log("rendered");

  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex justify-center p-8 bg-indigo-50">
        <form className="flex flex-col gap-4 w-2/4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="title">title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="py-1 px-2"
              value={todo.title}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="duedate">duedate</label>
            <input
              type="date"
              name="duedate"
              id="duedate"
              required
              className="py-1 px-2"
              value={todo.duedate}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="p-2 text-white rounded border bg-indigo-600">
              Register Todo
            </button>
          </div>
        </form>
      </section>
      <section className="flex justify-center p-8 flex-1 bg-yellow-50">
        <div className="flex flex-col gap-4 w-2/4">
          <select className="py-1 px-2" value={filter} onChange={handleChangeFilter}>
            <option value="ALL">ALL</option>
            <option value="NEW">NEW</option>
            <option value="DONE">DONE</option>
          </select>
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <label className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={todo.status === "DONE"}
                    onChange={(e) => handleChangeStatus(todo, e)}
                  />
                  {todo.title}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default App;
