import React from "react";
import akun from "../akun.jpg";
import { database } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import UserPost from "./user-post";
import { Link } from "react-router-dom";
import FollowerCard from "./follower-card";
import FollowingCard from "./following-card";

class UserDetailCard extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      option:'POST',
      modal: false,
      dataPost: [],
      loading: true,
      total_followers: null,
      total_following: null,
      follower_id: [],
      follower:[],
      following:[]
    };
  }

  async componentDidMount() {
    const db = collection(database, "user");
    const post = collection(database, "post");
    const id = this.props.id;
    const follower = collection(database, "user_follower");
    const q = query(db, where("uid", "==", id));
    const q2 = query(post, where("user_post_id", "==", id));
    const queryFollow = query(follower, where("uid", "==", id));

    // GET USER
    getDocs(q).then((res) => {
      res.docs.map((item) => {
        const data = item.data();
        return this.setState({
          data: (this.state.data = data),
          total_followers: (this.state.total_followers = data.total_follower),
          total_following: (this.state.total_following = data.total_following),
        });
      });
    });

               // GET FOLLOWER
               await getDocs(queryFollow).then(res => {
                res.docs.map(item => {
                  const data = item.data()
                  this.setState({
                    follower:this.state.follower = data.follower,
                    following:this.state.following = data.following
                  })
                    });
                  })

    //   GET ALL POST
    await getDocs(q2).then((res) => {
      if (res) {
        this.setState({
          dataPost: (this.state.dataPost = res),
          loading: (this.state.loading = false),
        });
      }
    });

    // GET FOLLOWER ID
    await getDocs(queryFollow).then((res) => {
      res.docs.map((item) => {
        const data = item.data();
        this.setState({
          follower_id: (this.state.follower_id = data.follower),
        });
      });
    });
  }

  async componentDidUpdate() {
    const db = collection(database, "user");
    const post = collection(database, "post");
    const id = this.props.id;
    const q = query(db, where("uid", "==", id));
    const q2 = query(post, where("user_post_id", "==", id));
    const follower = collection(database, "user_follower");
    const queryFollow = query(follower, where("uid", "==", id));

    // GET USER
    getDocs(q).then((res) => {
      res.docs.map((item) => {
        const data = item.data();
        return this.setState({
          data: (this.state.data = data),
          total_followers: (this.state.total_followers = data.total_follower),
        });
      });
    });

    //   GET ALL POST
    await getDocs(q2).then((res) => {
      if (res) {
        this.setState({
          dataPost: (this.state.dataPost = res),
          loading: (this.state.loading = false),
        });
      }
    });

    // GET FOLLOWER ID
    await getDocs(queryFollow).then((res) => {
      res.docs.map((item) => {
        const data = item.data();
        this.setState({
          follower_id: (this.state.follower_id = data.follower),
        });
      });
    });
  }

  followNotif = (user_id) => {
    const notif_id = user_id;
    const docUpdate = doc(database, "notifikasi", user_id);

    updateDoc(docUpdate, {
      notif: arrayUnion({
        pesan: `${this.props.user_name} Has been followed you`,
        user_name: this.props.user_name,
        user_id: notif_id,
        user_avatar: this.props.avatar,
      }),
    })
      .then(() => {
        alert("notif me senpai");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  following_profiles = (user_id) => {
    const current_user = this.props.ID;
    const docUpdate = doc(database, "user_follower", current_user);
    const user = doc(database, "user", this.props.ID);
    updateDoc(docUpdate, {
      following: arrayUnion(user_id),
    });
    updateDoc(user, {
      total_following: (this.state.total_following = +1),
    })
      .then(() => console.log("follow succes"))
      .catch((err) => {
        alert(err.message);
      });
  };

  follower_profiles = (user_id) => {
    const docUpdate = doc(database, "user_follower", user_id);
    const current_user = this.props.ID;
    updateDoc(docUpdate, {
      follower: arrayUnion(current_user),
    })
      .then(() => console.log("follow succes"))
      .catch((err) => {
        alert(err.message);
      });
  };

  follow = (e) => {
    const user_id = this.props.id;
    const is_follows = e.target.dataset.follow;
    const docUpdate = doc(database, "user", user_id);
    if (is_follows === user_id) {
      if (!e.target.classList.contains("following")) {
        this.follower_profiles(user_id);
        this.following_profiles(user_id);
        updateDoc(docUpdate, {
          total_follower: this.state.total_followers + 1,
        })
          .then(() => {
            alert("Follow succes");
            this.followNotif(user_id);
            this.setState({ hide: (this.state.hide = false) });
          })
          .catch((err) => {
            alert(err.message);
          });
        console.log("KOSONGxxx");
      } else {
        console.log("ada ASDASDAS");
        this.Remove(user_id);
        updateDoc(docUpdate, {
          total_follower: this.state.total_followers - 1,
        })
          .then(() => {
            alert("delete succes");
            this.setState({ hide: (this.state.hide = false) });
          })
          .catch((err) => {
            alert(err.message);
          });
      }
    }
  };

  Remove = (user_id) => {
    const removeNotif = doc(database, "notifikasi", user_id);
    const removeFollowing = doc(database, "user_follower", this.props.ID);
    const user = doc(database, "user", this.props.ID);
    const removeFollower = doc(database, "user_follower", user_id);

    updateDoc(removeFollower, {
      follower: arrayRemove(this.props.ID),
    });
    updateDoc(removeFollowing, {
      following: arrayRemove(user_id),
    });
    updateDoc(user, {
      total_following: (this.state.total_following = -1),
    })
      .then(() => {
        console.log("remove succes");
        console.log(this.state.follower_id.length);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  displayOption = (e) => {
    const id = e.target.dataset.name;
    this.setState({option:this.state.option = id})
  }
  render() {
    const postCard = Array.isArray(this.state.dataPost.docs)
      ? this.state.dataPost.docs.map((post, index) => {
          const posts = post.data();
          return <UserPost data={posts} />;
        })
      : "";

let test ;
        if(this.state.follower_id.length < 1){
          test = <button
          className="hvr-sweep-to-right"
          data-follow={this.props.id}
          onClick={this.follow}
        >
          Follow
        </button>
        }else{
          this.state.follower_id.map((id) => {
            if (id === this.props.ID) {
              return test = (
                <button
                  className="hvr-sweep-to-right following"
                  data-follow={this.props.id}
                  onClick={this.follow}
                >
                  Following
                </button>
              );
            } else {
  return  test = <button
  className="hvr-sweep-to-right"
  data-follow={this.props.id}
  onClick={this.follow}
>
  Follow
</button>
            }
          })
        }

    // const buttonFollow =
    //   this.state.follower_id.length < 1 ? 
    //     <button
    //       className="hvr-sweep-to-right"
    //       data-follow={this.props.id}
    //       onClick={this.follow}
    //     >
    //       Follow
    //     </button>
        
    //   : 
    //     this.state.follower_id.map((id) => {
    //       if (id === this.props.ID) {
    //         return (
    //           <button
    //             className="hvr-sweep-to-right following"
    //             data-follow={this.props.id}
    //             onClick={this.follow}
    //           >
    //             Following
    //           </button>
    //         );
    //       } else {

    //       }
    //     })


      const followCard = this.state.follower != null ? this.state.follower.map(data => {
        return <FollowerCard follow_id={data} user_id={this.props.id }/>
       }) : ""

       const followingCard = this.state.following != null ? this.state.following.map(data => {
         return <FollowingCard follow_id={data} user_id={this.props.id }/>
        }) : ""

    return (
      <div className="profile-container">
        <div className="user-info">
          <div className="judul-flex">
            <h3 className="form-judul">Profile</h3>
          </div>
          <div className="profile-info">
            <div className="user-name-wrapper">
              <div className="image-wrap">
                <img
                  src={this.state.data.images ? this.state.data.images : akun}
                />
              </div>
              <div className="user-name">
                <p className="text">{this.state.data.username}</p>
              </div>
            </div>
            <div className="user-edit">
            {test }

            <Link to={`/send-message/${this.props.id}`}>
            <button className="hvr-sweep-to-right"> Send Message</button>
            </Link>

            </div>
          </div>
        </div>
        {/* END USER INFO */}
        <div className='user-post-container'>
                        <ul className='judul-post'>
                          <li><span data-name="POST" onClick={this.displayOption}>POST {this.state.data.total_post}</span></li>
                          <li><span data-name="FOLLOWER" onClick={this.displayOption}>FOLLOWER {this.state.data.total_follower}</span></li>
                          <li><span data-name="FOLLOWING" onClick={this.displayOption}>FOLLOWING {this.state.data.total_following}</span></li>
                        </ul>
              </div>
        <div className='latest-post'>
               { this.state.option === 'POST' ? postCard : this.state.option === 'FOLLOWER' ? followCard : followingCard }
                </div>
      </div>
    );
  }
}

export default UserDetailCard;
