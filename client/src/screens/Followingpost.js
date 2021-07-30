import React, { useState, useEffect, useContext } from "react";
import { Usercontext } from "../App";
import { Link } from "react-router-dom";
function Followingpost() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(Usercontext);
  useEffect(() => {
    fetch("/following", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        if (result) {
          setData(result.posts);
        }
      });
  }, [data]);

  const likepost = (post_id) => {
    fetch("/like", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: post_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dislikepost = (post_id) => {
    fetch("/dislike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postid: post_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makecomment = (post_id, text) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postid: post_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result.comments[0].commentby.name);
        const newdata = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletepost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newdata = data.filter((item) => {
          return item._id !== postid;
        });
        setData(newdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletecomment = (postid, commentid) => {
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newdata = data.map((item) => {
          if (item._id == result._id) return result;
          else return item;
        });

        setData(newdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="homepage">
      {data.map((item) => {
        return (
          <div className="card home_card" key={item._id}>
            <h6
              style={{
                fontWeight: "500",
                textIndent: "8px",
                paddingBottom: "5px",
              }}
            >
              <Link
                to={
                  item.postedby._id !== state._id
                    ? "/myposts/" + item.postedby._id
                    : "/myposts"
                }
              >
                {item.postedby.name}
              </Link>
              {item.postedby._id == state._id ? (
                <i
                  onClick={() => deletepost(item._id)}
                  style={{ float: "right" }}
                  className="material-icons"
                >
                  delete_sweep
                </i>
              ) : null}
            </h6>
            <div className="card-image">
              <img className="image_home" src={item.image} />
            </div>
            <div className="card-content input-field">
              <i className="material-icons like">favorite</i>

              {!item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    likepost(item._id);
                  }}
                >
                  thumb_up
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    dislikepost(item._id);
                  }}
                >
                  thumb_down
                </i>
              )}

              <p>{item.likes.length} likes</p>
              <h6>{item.title}</h6>
              <p>{item.description}</p>

              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      <Link
                        to={
                          record.commentby._id !== state._id
                            ? "/myposts/" + record.commentby._id
                            : "/myposts/"
                        }
                      >
                        {record.commentby.name} :
                      </Link>
                    </span>{" "}
                    {record.text}
                    {record.commentby._id == state._id ? (
                      <i
                        onClick={() => deletecomment(item._id, record._id)}
                        style={{ float: "right" }}
                        className="material-icons"
                      >
                        delete_sweep
                      </i>
                    ) : null}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makecomment(item._id, e.target[0].value);
                  e.target[0].value = "";
                }}
              >
                <input type="text" placeholder="add comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Followingpost;
