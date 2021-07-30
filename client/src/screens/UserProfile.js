import React, { useEffect, useState, useContext } from "react";
import { Usercontext } from "../App";
import { useParams } from "react-router-dom";
function Profile() {
  const { state, dispatch } = useContext(Usercontext);
  const [userdata, setUserdata] = useState(null);
  const [update, setUpdate] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/user/${id}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((posts) => {
        //console.log(posts);
        setUserdata(posts);
      });
  }, [userdata]);

  const followuser = (uid) => {
    fetch("/follow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
  };
  const unfollowuser = (uid) => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
  };

  return (
    <>
      {userdata ? (
        <div className="profile">
          <div className="details">
            <div>
              <img
                className="prof_pic"
                src={userdata ? userdata.user.mypic : "loading"}
              />
            </div>
            <div className="description_prof">
              <h5>{userdata ? userdata.user.name : "loading"}</h5>
              <h6>{userdata ? userdata.user.email : "loading"}</h6>
              <div className="info_profile">
                <div>
                  <span className="bold_details">{userdata.posts.length}</span>{" "}
                  posts
                </div>
                <div>
                  <span className="bold_details">
                    {userdata.user.followers.length}
                  </span>{" "}
                  Followers
                </div>
                <div>
                  <span className="bold_details">
                    {userdata.user.followings.length}
                  </span>{" "}
                  Following
                </div>
              </div>
              {userdata.user.followers.includes(state._id) ? (
                <button
                  onClick={() => unfollowuser(userdata.user._id)}
                  className="btn button_profile"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => followuser(userdata.user._id)}
                  className="btn button_class"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className="images">
            {userdata.user.followers.includes(state._id) ? (
              userdata.posts.map((pics) => {
                return (
                  <img
                    alt=""
                    key={pics._id}
                    className="photos"
                    src={pics.image}
                  />
                );
              })
            ) : (
              <h3 style={{ textAlign: "center", margin: "30px auto" }}>
                Account is Private
              </h3>
            )}
          </div>
        </div>
      ) : (
        <h3>loading ......</h3>
      )}
    </>
  );
}

export default Profile;
