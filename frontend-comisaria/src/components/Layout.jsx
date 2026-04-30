import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>

      <Sidebar />

      <div style={{ flex: 1, background: '#f1f5f9', minHeight: '100vh' }}>
        {children}
      </div>

    </div>
  )
}

export default Layout