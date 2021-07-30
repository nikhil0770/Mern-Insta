import React, { useEffect, useState, useContext } from "react";
import { Usercontext } from "../App";
import M from "materialize-css";

function Profile() {
  const { state, dispatch } = useContext(Usercontext);
  const [post, setPost] = useState([]);
  const [userdata, setUserdata] = useState(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("/myposts", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((myposts) => {
        // console.log(myposts);
        setUserdata(myposts.userdata);
        setPost(myposts.mypost);
      });
  }, [userdata]);

  useEffect(() => {
    if (url) {
      fetch("/profilepic", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          mypic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            M.toast({ html: data.message, classes: "green" });
            // history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const updatepic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta_clone");
    data.append("cloud_name", "nikhilcloudinary");
    fetch("https://api.cloudinary.com/v1_1/nikhilcloudinary/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((imagedata) => {
        setUrl(imagedata.secure_url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="profile">
      <div className="details">
        <div>
          <img
            className="prof_pic"
            src={userdata ? userdata.mypic : "loading"}
          />
          <div className="file-field">
            <div className="btn file">
              <span>Upload Image</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button onClick={() => updatepic()} className="btn button_class">
            Update Pic
          </button>
        </div>
        <div className="description_prof">
          <h5>{state ? state.name : "loading"}</h5>
          <div className="info_profile">
            <div>
              <span className="bold_details">{post.length}</span> posts
            </div>
            <div>
              <span className="bold_details">
                {userdata == null ? "_" : userdata.followers.length}
              </span>{" "}
              Followers
            </div>
            <div>
              <span className="bold_details">
                {userdata == null ? "_" : userdata.followings.length}
              </span>{" "}
              Following
            </div>
          </div>
        </div>
      </div>
      <div className="images">
        {post.map((pics) => {
          return (
            <img alt="" key={pics._id} className="photos" src={pics.image} />
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
