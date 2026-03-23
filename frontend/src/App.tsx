import './App.css'
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import { AuthForm } from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TagsPage from './pages/TagsPage';
function App() {

  return (
    <Routes>
      <Route path='/' element={<EventsPage/>} />
      <Route path='/events/:id' element={<EventDetailsPage/>} />
      <Route path='/login' element={<AuthForm/>} />
      <Route path='/register' element={<AuthForm isRegister={true}/>} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/dashboard/tags" element={<TagsPage/>} />
        <Route path="/dashboard/create" element={<p>This is the create event</p>} />
        <Route path="/dashboard/edit/:id" element={<p>This is the edit event</p>} />
      </Route>
    </Routes>

  )
}

export default App
