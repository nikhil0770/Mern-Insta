import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { Usercontext } from "../App";
function Signin() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(Usercontext);
  const Signindata = () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user_details", JSON.stringify(data.user));
            dispatch({ type: "USER", payload: data.user });
            M.toast({ html: "Signedin Successfully", classes: "green" });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      M.toast({ html: "Invalid Email", classes: "red darken-3" });
    }
  };

  return (
    <div className="signin_card">
      <div class="card white input-field">
        <h3 style={{ textAlign: "center", fontFamily: "Grand Hotel" }}>
          Instagram
        </h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => Signindata()} className="btn button_class">
          Signin
        </button>
        <Link
          to="/signup"
          style={{ fontSize: "20px", fontFamily: "Grand Hotel" }}
        >
          Do not have account ?
        </Link>
      </div>
    </div>
  );
}

export default Signin;
