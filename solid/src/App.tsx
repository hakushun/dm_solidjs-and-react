import { Component, createMemo, createSignal, Index } from "solid-js";

type Status = "NEW" | "DONE";
type Todo = {
  id: string;
  title: string;
  duedate: string;
  status: Status;
};
type Filter = "ALL" | Status;
type EventTarget<T extends HTMLElement> = {
  currentTarget: T;
  target: Element;
};

const initialTodo: Todo = {
  id: "",
  title: "",
  duedate: "",
  status: "NEW",
};

const App: Component = () => {
  const [todo, setTodo] = createSignal<Todo>(initialTodo);
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [filter, setFilter] = createSignal<Filter>("ALL");

  const filteredTodos = createMemo(() => {
    switch (filter()) {
      case "ALL":
        return todos();
      case "NEW":
        return todos().filter((todo) => todo.status === "NEW");
      case "DONE":
        return todos().filter((todo) => todo.status === "DONE");
    }
  });

  const handleChange = (e: InputEvent & EventTarget<HTMLInputElement>) => {
    setTodo((prev) => ({ ...prev, [e.currentTarget.name]: e.currentTarget.value }));
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const generateId = () => Math.random().toString(32).substring(2);
    setTodos((prev) => [...prev, { ...todo(), id: generateId() }]);
    setTodo(initialTodo);
  };

  const handleChangeFilter = (e: Event & EventTarget<HTMLSelectElement>) => {
    setFilter(e.currentTarget.value as Filter);
  };

  const handleChangeStatus = (todo: Todo, e: InputEvent & EventTarget<HTMLInputElement>) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === todo.id
          ? {
              ...item,
              status: e.currentTarget.checked ? "DONE" : "NEW",
            }
          : item
      )
    );
  };

  console.log("rendered");

  return (
    <main class="flex flex-col min-h-screen">
      <section class="flex justify-center p-8 bg-indigo-50">
        <form class="flex flex-col gap-4 w-2/4" onSubmit={handleSubmit}>
          <div class="flex flex-col">
            <label for="title">title</label>
            <input
              type="text"
              name="title"
              id="title"
              class="py-1 px-2"
              required
              value={todo().title}
              onInput={handleChange}
            />
          </div>
          <div class="flex flex-col">
            <label for="duedate">duedate</label>
            <input
              type="date"
              name="duedate"
              id="duedate"
              class="py-1 px-2"
              required
              value={todo().duedate}
              onInput={handleChange}
            />
          </div>
          <div class="flex justify-center">
            <button type="submit" class="p-2 text-white rounded border bg-indigo-600">
              Register Todo
            </button>
          </div>
        </form>
      </section>
      <section class="flex justify-center p-8 flex-1 bg-yellow-50">
        <div class="flex flex-col gap-4 w-2/4">
          <select class="py-1 px-2" value={filter()} onChange={handleChangeFilter}>
            <option value="ALL">ALL</option>
            <option value="NEW">NEW</option>
            <option value="DONE">DONE</option>
          </select>
          <ul>
            <Index each={filteredTodos()}>
              {(todo) => (
                <li>
                  <label class="flex gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todo().status === "DONE"}
                      onInput={(e) => handleChangeStatus(todo(), e)}
                    />
                    {todo().title}
                  </label>
                </li>
              )}
            </Index>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default App;
