import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import CreateNews from './pages/CreateNews';
import EditNews from './pages/EditNews';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/create" element={<CreateNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/news/:id/edit" element={<EditNews />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
