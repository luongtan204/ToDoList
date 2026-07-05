import { useState, useEffect } from 'react';
import api from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // State cho bộ lọc
  const [statusFilter, setStatusFilter] = useState(''); // '' (Tất cả), 'PENDING', 'COMPLETED'
  const [keyword, setKeyword] = useState('');

  // 1. Hàm gọi API
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const params = { size: 50 };
      if (statusFilter) params.status = statusFilter;
      if (keyword) params.keyword = keyword;

      const response = await api.get('', { params });
      setTodos(response.data.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [statusFilter]);

  // 2. Hàm Thêm mới
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post('', { title, description, status: 'PENDING' });
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };

  // 3. Hàm Đổi trạng thái
  const handleToggleStatus = async (todo) => {
    const newStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.put(`/${todo.id}`, {
        title: todo.title,
        description: todo.description,
        status: newStatus
      });
      fetchTodos();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  // 4. Hàm Xóa
  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-zinc-200">
      
      {/* Background Decor (Subtle blurs) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-sky-100/30 blur-3xl" />
      </div>

      <div className="w-full max-w-3xl">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            My Tasks
          </h1>
          <p className="mt-3 text-lg text-zinc-500 font-medium">
            Stay organized, focused, and productive.
          </p>
        </header>

        {/* Input Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 overflow-hidden mb-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:border-zinc-300 focus-within:ring-4 focus-within:ring-zinc-100/50">
          <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row p-2 gap-2">
            <div className="flex-1 w-full px-4 py-3 flex flex-col justify-center">
              <input
                type="text"
                placeholder="What needs to be done?"
                className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 font-semibold text-lg focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Add some details... (optional)"
                className="w-full bg-transparent text-zinc-500 placeholder-zinc-300 text-sm mt-1.5 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center p-2">
               <button 
                type="submit"
                disabled={!title.trim()}
                className="w-full sm:w-auto h-full min-h-[50px] bg-zinc-900 text-white rounded-xl px-6 font-semibold flex items-center justify-center gap-2 transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
              >
                <span>Add Task</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Main List Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 overflow-hidden flex flex-col">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50/50 gap-4">
            
            {/* Filter Tabs */}
            <div className="flex bg-zinc-100/80 rounded-xl p-1.5 w-full sm:w-auto">
              {['', 'PENDING', 'COMPLETED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    statusFilter === filter
                      ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-black/5'
                      : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
                  }`}
                >
                  {filter === '' ? 'All' : filter === 'PENDING' ? 'Active' : 'Completed'}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-4 py-2.5 border border-zinc-200/80 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 sm:text-sm transition-all shadow-sm font-medium text-zinc-800"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* List content */}
          <div className="divide-y divide-zinc-100/80 min-h-[350px] flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
                <svg className="animate-spin h-6 w-6 text-zinc-900" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium text-zinc-600">Syncing tasks...</span>
              </div>
            ) : todos.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-zinc-400">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-zinc-900">No tasks found</p>
                <p className="text-sm mt-1 text-zinc-500">You're all caught up! Enjoy your day.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {todos.map(todo => (
                  <div 
                    key={todo.id} 
                    className="group flex items-start gap-4 p-5 transition-all hover:bg-zinc-50/80"
                  >
                    <button 
                      onClick={() => handleToggleStatus(todo)}
                      className={`mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${
                        todo.status === 'COMPLETED' 
                          ? 'bg-zinc-900 border-zinc-900 text-white' 
                          : 'border-zinc-300 bg-white hover:border-zinc-400 group-hover:shadow-sm'
                      }`}
                    >
                      <svg className={`w-3.5 h-3.5 transition-all duration-300 ${todo.status === 'COMPLETED' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-base font-semibold truncate transition-all duration-300 ${
                        todo.status === 'COMPLETED' ? 'text-zinc-400 line-through' : 'text-zinc-800'
                      }`}>
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p className={`text-sm mt-1.5 line-clamp-2 transition-all duration-300 ${
                          todo.status === 'COMPLETED' ? 'text-zinc-300 line-through' : 'text-zinc-500'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
        
      </div>
    </div>
  );
}

export default App;
