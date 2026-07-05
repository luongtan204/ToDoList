package com.todolist.todo.service;

import com.todolist.todo.dto.TodoRequest;
import com.todolist.todo.dto.TodoResponse;
import org.springframework.data.domain.Page;

public interface TodoService {

    Page<TodoResponse> getTodos(int page, int size);

    TodoResponse getTodoById(Long id);

    TodoResponse createTodo(TodoRequest request);

    TodoResponse updateTodo(Long id, TodoRequest request);

    void deleteTodo(Long id);
}

