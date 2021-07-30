import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          description: desc,
          image: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            M.toast({ html: data.message, classes: "green" });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postdetails = () => {
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
    <div className="createpost">
      <div className="card post_card input-field">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
          placeholder="Description"
        />
        <div className="file-field">
          <div className="btn file">
            <span>Upload Image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button onClick={() => postdetails()} className="btn button_class">
          Submit post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
