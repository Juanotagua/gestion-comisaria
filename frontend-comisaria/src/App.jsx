import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Casos from './pages/Casos'
import Login from './pages/Login'
import Layout from './components/Layout'
import CrearCaso from './pages/CrearCaso'

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/crear-caso" element={<CrearCaso />} />

        {/* Login SIN sidebar */}
        <Route path="/" element={<Login />} />

        {/* Todo lo demás CON sidebar */}
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

      </Routes>
    </BrowserRouter>
  )
}

export default App