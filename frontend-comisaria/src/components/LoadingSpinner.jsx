function LoadingSpinner() {

  return (

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px'
    }}>

      <div style={{
        width: '60px',
        height: '60px',
        border: '6px solid #E2E8F0',
        borderTop: '6px solid #8B1E2D',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />

      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

    </div>

  )

}

export default LoadingSpinner