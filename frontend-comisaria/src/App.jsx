import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Casos from './pages/Casos'
import Login from './pages/Login'
import Layout from './components/Layout'
import CrearCaso from './pages/CrearCaso'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Login SIN sidebar */}
        <Route path="/" element={<Login />} />

        {/* 🔐 RUTAS CON LAYOUT */}
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />

        <Route path="/casos" element={
          <Layout>
            <Casos />
          </Layout>
        } />

        <Route path="/usuarios" element={
          <Layout>
            <Usuarios />
          </Layout>
        } />
        <Route path="/reportes" element={
        <Layout>
         <Reportes />
        </Layout>
        } />

        <Route path="/crear-caso" element={
          <Layout>
            <CrearCaso />
          </Layout>
        } />
        
        <Route
         path="/forgot-password"
         element={<ForgotPassword />
         }
        />
        <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App