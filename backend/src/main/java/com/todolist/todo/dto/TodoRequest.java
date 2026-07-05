package com.todolist.todo.dto;

import com.todolist.todo.entity.TodoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TodoRequest(
        @NotBlank(message = "Tiêu đề công việc không được để trống")
        @Size(max = 255, message = "Tiêu đề công việc không được vượt quá 255 ký tự")
        String title,
        @Size(max = 5000, message = "Mô tả công việc không được vượt quá 5000 ký tự")
        String description,
        TodoStatus status
) {
}

