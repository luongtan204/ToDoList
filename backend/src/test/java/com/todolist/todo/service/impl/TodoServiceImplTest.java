package com.todolist.todo.service.impl;

import com.todolist.common.exception.ResourceNotFoundException;
import com.todolist.todo.dto.TodoRequest;
import com.todolist.todo.dto.TodoResponse;
import com.todolist.todo.entity.Todo;
import com.todolist.todo.entity.TodoStatus;
import com.todolist.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@SuppressWarnings("MockitoPotentialStubbingProblem")
public class TodoServiceImplTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoServiceImpl todoService;

    private Todo mockTodo;
    private TodoRequest mockRequest;

    @BeforeEach
    void setUp() {
        mockTodo = new Todo();
        mockTodo.setId(1L);
        mockTodo.setTitle("Học Spring Boot");
        mockTodo.setDescription("Làm bài test Intern");
        mockTodo.setStatus(TodoStatus.PENDING);

        mockRequest = new TodoRequest("Học Spring Boot", "Làm bài test Intern", TodoStatus.PENDING);
    }

    @Test
    void getTodos_WithFilters_ReturnsPagedTodoResponses() {
        PageRequest expectedPageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Todo> todoPage = new PageImpl<>(List.of(mockTodo), expectedPageable, 1);
        doReturn(todoPage).when(todoRepository).findByFilters(eq(TodoStatus.PENDING), eq("Spring"), any(Pageable.class));

        Page<TodoResponse> response = todoService.getTodos(TodoStatus.PENDING, "  Spring  ", 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals("Học Spring Boot", response.getContent().get(0).title());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(todoRepository, times(1)).findByFilters(eq(TodoStatus.PENDING), eq("Spring"), pageableCaptor.capture());
        assertEquals(expectedPageable.getPageNumber(), pageableCaptor.getValue().getPageNumber());
        assertEquals(expectedPageable.getPageSize(), pageableCaptor.getValue().getPageSize());
        assertEquals(expectedPageable.getSort(), pageableCaptor.getValue().getSort());
    }

    @Test
    void getTodos_WithoutFilters_ReturnsPagedTodoResponses() {
        PageRequest expectedPageable = PageRequest.of(1, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Todo> todoPage = new PageImpl<>(List.of(mockTodo), expectedPageable, 6);
        doReturn(todoPage).when(todoRepository).findByFilters(isNull(), isNull(), any(Pageable.class));

        Page<TodoResponse> response = todoService.getTodos(null, null, 1, 5);

        assertNotNull(response);
        assertEquals(6, response.getTotalElements());
        assertEquals(2, response.getTotalPages());
        assertEquals(1, response.getContent().size());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(todoRepository, times(1)).findByFilters(isNull(), isNull(), pageableCaptor.capture());
        assertEquals(expectedPageable.getPageNumber(), pageableCaptor.getValue().getPageNumber());
        assertEquals(expectedPageable.getPageSize(), pageableCaptor.getValue().getPageSize());
        assertEquals(expectedPageable.getSort(), pageableCaptor.getValue().getSort());
    }

    @Test
    void getTodoById_Success_ReturnsTodoResponse() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(mockTodo));

        TodoResponse response = todoService.getTodoById(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Học Spring Boot", response.title());
        verify(todoRepository, times(1)).findById(1L);
    }

    @Test
    void getTodoById_NotFound_ThrowsException() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> todoService.getTodoById(99L)
        );

        assertTrue(exception.getMessage().contains("Không tìm thấy công việc"));
    }

    @Test
    void createTodo_Success_ReturnsTodoResponse() {
        when(todoRepository.save(any(Todo.class))).thenReturn(mockTodo);

        TodoResponse response = todoService.createTodo(mockRequest);

        assertNotNull(response);
        assertEquals("Học Spring Boot", response.title());
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void deleteTodo_Success() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(mockTodo));
        doNothing().when(todoRepository).delete(mockTodo);

        todoService.deleteTodo(1L);

        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).delete(mockTodo);
    }
}

