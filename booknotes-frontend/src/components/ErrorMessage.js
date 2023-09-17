const ErrorMessage = ({ errorMessage }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }} className="errorMessage">
      <p style={{ marginRight: "10px", color: "red" }}>{ErrorMessage}</p>
    </div>
  )
}

export default ErrorMessage