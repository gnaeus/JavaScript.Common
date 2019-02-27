## Иерархический DI в 450 B (min+gzip) на React Hooks

1. Региструруем области видимости сервисов-зависимостей с помощью HOC __`withProvider`__.
2. Внедряем зависимости с помощью React Hooks __`useFactory`__ и __`useService`__.

### __`useFactory(factory, args?)`__

React Hook для внедрения значения-зависимости, созданного с помощбю фабрики:
- в props Functional компонента
- или в конструктор другого класса-зависимости
- или в аргументы для фабрики зависимости

```jsx
const TodoModel = () => observable({
  todoItems: []
});

const TodoService = (todoModel = useFactory(TodoModel)) => {
  let nextId = 1;

  const addTodo = action(text => {
    todoModel.todoItems.push({ id: nextId++, text });
  });

  const removeTodo = action(id => {
    todoModel.todoItems.splice()
  });

  return { addTodo, removeTodo };
}

const TodoList = ({
  todoModel = useFactory(TodoModel),
  todoService = useFactory(TodoService),
}) => (
  <ul>
    {todoModel.todoItems.map(item => (
      <li onClick={() => todoService.removeTodo(item.id)}>
        {item.text}
      </li>
    ))}
  </ul>
);

export default observer(TodoList);
```

### __`useService(constructor, args?)`__

React Hook для внедрения класса-зависимости:
- в props Functional компонента
- или в конструктор другого класса-зависимости
- или в аргументы для фабрики зависимости

```jsx
class TodoModel {
  @observable todoItems = [];
}

class TodoService {
  constructor(todoModel = useService(TodoModel)) {
    this.todoModel = todoModel;
  }

  @action addTodo(text) {
    // ...
  }

  @action removeTodo(id) {
    // ...
  }
}
```

### __`withProvider(...services)`__

HOC для привязки времени жизни и области видимости зависимостей к указанному компоненту

```jsx
const App = () => <TodoList />;

export default withProvider(TodoModel, TodoService)(App);
```

### Опциональный аргумент __`args`__

Служит для переопределение зависимостей в runtime

```jsx
const = TodoProvider(
  userId, todoModel = useFactory(TodoModel)
) => {
  async function loadTodos() {
    const response = await fetch(`/users/${userId}/todos`);
    return await response.json();
  }

  return { loadTodos };
}

const TodoLoader = ({
  userId, todoProvider = useFactory(TodoProvider, [userId])
}) => (
  <button onClick={todoProvider.loadTodos}>
    Load
  </button>
)
```
