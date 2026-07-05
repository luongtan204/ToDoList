package com.todolist.todo.service.impl;

import com.todolist.common.exception.ResourceNotFoundException;
import com.todolist.todo.dto.TodoRequest;
import com.todolist.todo.dto.TodoResponse;
import com.todolist.todo.entity.Todo;
import com.todolist.todo.entity.TodoStatus;
import com.todolist.todo.repository.TodoRepository;
import com.todolist.todo.service.TodoService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TodoResponse> getTodos(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return todoRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id) {
        return toResponse(findTodoById(id));
    }

    @Override
    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = new Todo();
        applyRequest(todo, request);
        return toResponse(todoRepository.save(todo));
    }

    @Override
    public TodoResponse updateTodo(Long id, TodoRequest request) {
        Todo todo = findTodoById(id);
        applyRequest(todo, request);
        return toResponse(todoRepository.save(todo));
    }

    @Override
    public void deleteTodo(Long id) {
        Todo todo = findTodoById(id);
        todoRepository.delete(todo);
    }

    private Todo findTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc với id = " + id));
    }

    private void applyRequest(Todo todo, TodoRequest request) {
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setStatus(request.status() != null ? request.status() : TodoStatus.PENDING);
    }

    private TodoResponse toResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getStatus()
        );
    }
}

