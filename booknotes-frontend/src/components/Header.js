const Header = ({ user, logout }) => {
  return (
    <div className="navbar sticky-top">
      <div>Menu</div>
      <div className="title-wrapper">
      <span className="header-title">bookNotes</span>
      </div>
      <div>
      {user && <button className="logout-btn" onClick={logout}>Logout</button>}
      </div>
    </div>
  )
}

export default Header
