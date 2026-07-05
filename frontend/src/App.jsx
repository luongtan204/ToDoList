import { useState, useEffect } from 'react';
import api from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Form Thêm mới
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Bộ lọc & Tìm kiếm
  const [statusFilter, setStatusFilter] = useState(''); 
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Form Chỉnh sửa
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. Fetch Danh sách
  const fetchTodos = async (page = 0) => {
    setLoading(true);
    try {
      const params = { size: 5, page: page }; 
      if (statusFilter) params.status = statusFilter;
      if (debouncedKeyword) params.keyword = debouncedKeyword;

      const response = await api.get('/todos', { params });
      setTodos(response.data.data.content);
      setCurrentPage(response.data.data.page);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hiệu ứng Debounce cho thanh tìm kiếm (giả lập loading khi gõ)
  useEffect(() => {
    if (keyword !== debouncedKeyword) {
      setIsTyping(true);
      const delay = setTimeout(() => {
        setDebouncedKeyword(keyword);
        setIsTyping(false);
      }, 600); // Đợi 600ms sau khi ngừng gõ mới thực hiện tìm
      return () => clearTimeout(delay);
    }
  }, [keyword, debouncedKeyword]);

  // Gọi API khi bộ lọc hoặc từ khóa tìm kiếm (đã debounce) thay đổi
  useEffect(() => {
    fetchTodos(0); 
  }, [statusFilter, debouncedKeyword]);

  // 2. Thêm mới
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post('/todos', { title, description, status: 'PENDING' });
      setTitle('');
      setDescription('');
      fetchTodos(0); 
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      alert("Không thể thêm công việc: " + (error.response?.data?.message || error.message));
    }
  };

  // 3. Đổi trạng thái
  const handleToggleStatus = async (todo) => {
    const newStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.put(`/todos/${todo.id}`, {
        title: todo.title,
        description: todo.description,
        status: newStatus
      });
      fetchTodos(currentPage);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  // 4. Chỉnh sửa
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (todo) => {
    if (!editTitle.trim()) {
      cancelEditing();
      return;
    }
    try {
      await api.put(`/todos/${todo.id}`, {
        title: editTitle,
        description: editDescription,
        status: todo.status
      });
      setEditingId(null);
      fetchTodos(currentPage);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  };

  // 5. Xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa công việc này nhé?")) return;
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos(currentPage);
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <div className="w-full max-w-3xl mx-auto py-12 px-6">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Công việc của tôi
          </h1>
          <p className="mt-1.5 text-zinc-500">
            Quản lý, theo dõi và hoàn thành mục tiêu mỗi ngày.
          </p>
        </header>

        {/* Khung Thêm Mới */}
        <div className="mb-12">
          <form onSubmit={handleAddTodo} className="border-2 border-zinc-200 rounded-xl p-1.5 focus-within:border-zinc-800 transition-colors bg-zinc-50/50">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex flex-col justify-center px-3 py-2 gap-1.5">
                <input
                  type="text"
                  placeholder="Bạn muốn làm gì hôm nay?"
                  className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 font-medium focus:outline-none text-base"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {/* Chỉ hiện ô nhập mô tả khi bắt đầu gõ tiêu đề */}
                {title.length > 0 && (
                  <input
                    type="text"
                    placeholder="Thêm mô tả chi tiết... (không bắt buộc)"
                    className="w-full bg-transparent text-zinc-500 placeholder-zinc-300 focus:outline-none text-sm animate-in fade-in"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                )}
              </div>
              <button 
                type="submit"
                disabled={!title.trim()}
                className="bg-zinc-900 text-white rounded-lg px-6 py-3 font-semibold hover:bg-zinc-800 transition-all disabled:opacity-40 flex items-center justify-center whitespace-nowrap shadow-sm active:scale-95 m-1"
              >
                Thêm ngay
              </button>
            </div>
          </form>
        </div>

        {/* Thanh công cụ: Lọc & Tìm kiếm */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 border-b border-zinc-100 pb-4">
          <div className="flex gap-6">
             <button
               onClick={() => setStatusFilter('')}
               className={`text-sm font-semibold transition-all ${statusFilter === '' ? 'text-zinc-900 border-b-2 border-zinc-900 pb-1' : 'text-zinc-400 hover:text-zinc-700 pb-1'}`}
             >
               Tất cả
             </button>
             <button
               onClick={() => setStatusFilter('PENDING')}
               className={`text-sm font-semibold transition-all ${statusFilter === 'PENDING' ? 'text-zinc-900 border-b-2 border-zinc-900 pb-1' : 'text-zinc-400 hover:text-zinc-700 pb-1'}`}
             >
               Đang chờ
             </button>
             <button
               onClick={() => setStatusFilter('COMPLETED')}
               className={`text-sm font-semibold transition-all ${statusFilter === 'COMPLETED' ? 'text-zinc-900 border-b-2 border-zinc-900 pb-1' : 'text-zinc-400 hover:text-zinc-700 pb-1'}`}
             >
               Đã xong
             </button>
          </div>
          
          <div className="relative w-full sm:w-64">
            {isTyping ? (
              <svg className="animate-spin absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:border-zinc-400 focus:outline-none transition-all text-sm font-medium"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách Công việc */}
        <div className="min-h-[300px] flex flex-col">
          {loading && !isTyping ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-3">
              <svg className="animate-spin h-6 w-6 text-zinc-300" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Đang tải dữ liệu...</span>
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
              <svg className="w-12 h-12 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-lg font-semibold text-zinc-700">Trống trơn!</p>
              <p className="text-sm mt-1 text-zinc-400">Không tìm thấy công việc nào phù hợp.</p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-zinc-100">
              {todos.map(todo => (
                <li key={todo.id} className="group flex items-start gap-4 py-4 transition-all">
                  
                  {/* Nút Checkbox */}
                  <button 
                    onClick={() => handleToggleStatus(todo)}
                    className={`mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-200 ${
                      todo.status === 'COMPLETED' 
                        ? 'bg-zinc-900 border-zinc-900 text-white' 
                        : 'border-zinc-300 bg-white hover:border-zinc-500'
                    }`}
                  >
                    <svg className={`w-3.5 h-3.5 transition-all ${todo.status === 'COMPLETED' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  {/* Nội dung Task */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex flex-col gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-200 animate-in fade-in">
                        <input
                          autoFocus
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-transparent font-semibold text-zinc-900 focus:outline-none"
                          placeholder="Tiêu đề..."
                        />
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Mô tả chi tiết..."
                          className="w-full bg-transparent text-sm text-zinc-600 focus:outline-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveEdit(todo)}
                            className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-md hover:bg-zinc-800 transition-colors"
                          >
                            Lưu lại
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-1.5 bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-md hover:bg-zinc-300 transition-colors"
                          >
                            Hủy bỏ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-0.5">
                        <p 
                          className={`text-base font-medium transition-all duration-300 ${
                            todo.status === 'COMPLETED' ? 'text-zinc-400 line-through' : 'text-zinc-800'
                          }`}
                        >
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p 
                            className={`text-sm mt-1 transition-all duration-300 ${
                              todo.status === 'COMPLETED' ? 'text-zinc-300 line-through' : 'text-zinc-500'
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Cụm Nút Xóa / Sửa (chỉ hiện khi di chuột vào) */}
                  <div className={`flex items-center gap-1 transition-opacity ${editingId === todo.id ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={() => startEditing(todo)}
                      className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa công việc"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(todo.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa công việc"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Điều hướng Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-zinc-100">
            <span className="text-sm text-zinc-500 font-medium">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchTodos(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-50"
              >
                Trước
              </button>
              <button
                onClick={() => fetchTodos(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40 disabled:hover:bg-zinc-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
