const ErrorMessage = ({ errorMessage }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }} className="errorMessage">
      <p style={{ margin: "10px", color: "red" }}>{errorMessage}</p>
    </div>
  )
}

export default ErrorMessage