package com.todolist.todo.dto;

import com.todolist.todo.entity.TodoStatus;

public record TodoResponse(
        Long id,
        String title,
        String description,
        TodoStatus status
) {
}

