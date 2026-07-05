package com.todolist.todo.repository;

import com.todolist.todo.entity.Todo;
import com.todolist.todo.entity.TodoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface TodoRepository extends JpaRepository<Todo, Long> {

	@Query("""
			select t from Todo t
			where (:status is null or t.status = :status)
			  and (
					:keyword is null or :keyword = ''
					or lower(t.title) like lower(concat('%', :keyword, '%'))
					or lower(coalesce(t.description, '')) like lower(concat('%', :keyword, '%'))
				  )
			""")
	Page<Todo> findByFilters(@Param("status") TodoStatus status,
						   @Param("keyword") String keyword,
						   Pageable pageable);
}

