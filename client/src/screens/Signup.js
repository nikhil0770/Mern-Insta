import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Postdata = () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            M.toast({ html: data.message, classes: "green" });
            history.push("/signin");
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
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button className="btn button_class" onClick={() => Postdata()}>
          Signup
        </button>
        <Link
          to="/signin"
          style={{ fontSize: "20px", fontFamily: "Grand Hotel" }}
        >
          Already have an account ?
        </Link>
      </div>
    </div>
  );
}

export default Signup;
