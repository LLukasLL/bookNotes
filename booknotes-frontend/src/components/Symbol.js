const Symbol = ({ path, color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color} class="bi bi-share" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
      {path}
    </svg>
  )
}

export default Symbol