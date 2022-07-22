import React from "react";
import { Link } from "react-router-dom";
import user from '../akun.jpg'
import {database} from '../firebase';
import { collection, addDoc ,getDocs, doc, updateDoc, deleteDoc,onSnapshot, setDoc, query, orderBy, where} from 'firebase/firestore';
import '../header.css'
import NotifCard  from "./notif-card";


class Header extends React.Component{
constructor(){
  super()
  this.state = {
   header:React.createRef(),
   dropMenu:React.createRef(),
   notifList:React.createRef(),
    y:window.scrollX ,
    dropDown:true
  }
}

 async componentDidMount(){
  window.addEventListener('scroll',this.scrolls)
//   const id = this.props.email
//   const db = collection(database,'notifikasi')
//   const q = query(db ,where("notif_id","==" ,id))
// await getDocs(q).then(res => {
//   res.docs.map(item => {
//     const data = item.data()
// this.setState({notifs:this.state.notifs = data.notif})
//   })
// })

 }
 
 scrolls = (e) => {
   let x = window.scrollY;
 if (x > 0) {
  const header = this.state.header.current
   header.classList.add("fixed-header");

 }else {
  const header = this.state.header.current
   header.classList.remove("fixed-header");
 }
 
 this.setState({y:this.state.y = x})
 }
 
 dropDown = (e) => {
   e.preventDefault()
   const showMenu = this.state.dropMenu.current
   console.log(showMenu);
   showMenu.classList.toggle('show')
 }


 openNotif = (e) => {
  e.preventDefault()
 const notif_list = this.state.notifList.current
 notif_list.classList.toggle('show')
 }
  render(){

console.log(     this.props.avatar === '' );
     const notif_list = this.props.notif == null ? console.log("kosong") : this.props.notif.map((m,i)=> {
      return <NotifCard  data={m} key={i}/>
     }) 
    return(
            <header class="header" ref={this.state.header}>
<nav className="navbar">
<ul class="menu-kiri">
          <li>
            <Link to='/' className="logo">SimpleForum</Link>
          </li>
        </ul>
        <ul class={this.props.isLogin ? "menu-kanan" : "hide"}>
          <li className='create-post'><a href="#0" onClick={this.props.createPost}>Create Post</a></li>
          <li><i className={this.props.isLogin ? "fa fa-bell notif" : "hide"} aria-hidden="true" onClick={this.openNotif}> <span className={this.props.notif == null ? "hide" : "notif-number"}>{this.props.notif == null ? "" : this.props.notif.length}</span></i>
          <div className={this.props.notif == null ? "hide" : "notif-list"} ref={this.state.notifList}>
          {notif_list }
          </div>
          </li>
          <li className="drop-down">
           <img src={this.props.avatar === '' ? user : this.props.avatar} onClick={this.dropDown}/>
           <ul className={this.props.isLogin ? "drop-list" : "hide"} ref={this.state.dropMenu}>
            <li><Link to={`/account/${this.props.id}`}>Profile</Link></li>
            <li><Link to={`/message/${this.props.id}`}>Message</Link></li>
            <li><Link to='#' onClick={this.props.logout}>Log out</Link></li>
           </ul>
          </li>
        </ul>
</nav>
      </header>
    )
  }
}

export default Header;