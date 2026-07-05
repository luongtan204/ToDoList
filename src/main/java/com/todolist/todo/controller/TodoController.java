package com.todolist.todo.controller;

import com.todolist.common.response.ApiResponse;
import com.todolist.common.response.PageResponse;
import com.todolist.todo.dto.TodoRequest;
import com.todolist.todo.dto.TodoResponse;
import com.todolist.todo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TodoResponse>>> getTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<TodoResponse> todoPage = todoService.getTodos(page, size);
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK.value(), "Lấy danh sách công việc thành công", PageResponse.from(todoPage, item -> item))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> getTodoById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK.value(), "Lấy công việc thành công", todoService.getTodoById(id))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> createTodo(@Valid @RequestBody TodoRequest request) {
        TodoResponse created = todoService.createTodo(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(HttpStatus.CREATED.value(), "Tạo công việc thành công", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> updateTodo(@PathVariable Long id, @Valid @RequestBody TodoRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK.value(), "Cập nhật công việc thành công", todoService.updateTodo(id, request))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK.value(), "Xóa công việc thành công", null)
        );
    }
}

