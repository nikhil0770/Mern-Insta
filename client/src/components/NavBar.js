import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Usercontext } from "../App";

function NavBar() {
  const { state, dispatch } = useContext(Usercontext);
  const history = useHistory();
  const renderList = () => {
    //state has user details because when we are logged in
    // we dispatch userContext with user details
    if (state) {
      return [
        <li>
          <Link to="/followingpost">Followings</Link>
        </li>,
        <li>
          <Link to="/createpost">CreatePost</Link>
        </li>,
        <li>
          <Link to="/myposts">Profile</Link>
        </li>,
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("jwt");
              localStorage.removeItem("user_details");
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
            className="btn button_class"
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper header">
        <div className="logo">
          <Link to={state ? "/" : "/signin"} className="brand-logo left logo">
            Instagram
          </Link>
        </div>
        <div className="sections">
          <ul id="nav-mobile" className="right navurl">
            {renderList()}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
