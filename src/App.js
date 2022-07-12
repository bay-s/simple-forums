import logo from './logo.svg';
import React from 'react'
import './index.css';
import {database,auth,secondAuth } from './firebase';
import '@firebase/firestore'
import { BrowserRouter as Router, Switch, Route ,Routes} from 'react-router-dom';
import { collection, addDoc ,getDocs, doc, updateDoc, deleteDoc,onSnapshot , setDoc, query, where, getDocsFromCache} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider,  onAuthStateChanged,signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import 'font-awesome/css/font-awesome.min.css';
import Header from './component/header';
import NotFound from './404not';
import Home from './component/register-login';
import AccountPage from './component/account-profile-page';
import PostPage from './component/post';
import ModalPost from './component/modal-post';
import PostDetail from './component/post-detail';
import PostCategory from './component/post-category';



class App extends React.Component{


    constructor(){
        super()
        this.state = {
        data:collection(database,'user'),
        password:'',
        email:'',
        fullname:'',
        username:'',
        error:false,
        pesan:'sssssss',
        sukses:false,
        disable:false,
        isLogin:false,
        uid:'',
        modal:false,
        akunUserName:'',
        akunFullName:'',
        akunEmail:'',
        akunImages:'',
        totalPost:0,
        hide:true,
        notif:[]
        }
      }

  async componentDidMount(){
        const db = collection(database,'user')
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              const q = query(db,where("uid","==" , uid))
              // GET USER LOGIN
  
           await getDocs(q).then(res => {
                res.docs.map(item => {
                const data = item.data()
                console.log(data);
                const test = JSON.stringify(item.data())
                  return this.setState({ 
                    akunUserName:this.state.akunUserName = data.username,
                    akunImages:this.state.akunImages = data.images,
                    totalPost:this.state.totalPost = data.total_post,
                    akunFullName:this.state.akunFullName = data.fullname,
                    akunEmail:this.state.akunEmail = data.email
                    })  
                  });
                })
              
  const db1 = collection(database,'notifikasi')
  const q2 = query(db1 ,where("notif_id","==" ,this.state.akunEmail))
await getDocs(q2).then(res => {
  console.log(res);
  res.docs.map(item => {
    const data = item.data()
this.setState({notif:this.state.notif = data.notif})
  })
})
             this.setState({
               isLogin:this.state.isLogin = true,
               uid:this.state.uid = uid
            })
             console.log('user log in');
            } else {
              // User is signed out
              localStorage.clear();
              this.setState({isLogin:this.state.isLogin = false})
              console.log("user log out");
            }
          });

        }
      
        
        handlerChange = (e) => {
          const {name,value} = e.target
          console.log(value);
          this.setState(prev => {
            return{
         [name]:value
            }
          })
      
        if(this.state.username.length < 8 && this.state.email.length < 8 && this.state.password.length < 8 || this.state.fullname.length < 8) {
          this.setState({
            disable:this.state.disable = true
          })
          }else{
            disable:this.state.disable = false
          }
      
        }
      
  
        
  userFollowerInfo = (notif ,ID) => {

setDoc(doc(notif,ID), {
      notif_id:this.state.email,
      notif_likes:[],
      notif_comment:[],
      notif_messages:[],
      notif_following:[],
      notif_follower:[],
   })      
setDoc(doc(ID), {
  follower:[],
  following:[],
  uid:ID
    })
    .then(() => {console.log('sukses');})  
  .catch((err) => {alert(`something wrong ${err}`)})
  }

  registerAkun = (e) => {

        const notif = collection(database,'notifikasi')
        this.setState({hide:this.state.hide = false})  
        createUserWithEmailAndPassword(secondAuth ,this.state.email,this.state.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const ID = user.uid
          this.setState({
            errorMessage:"Register sukses",
            sukses:true
          })
        const db = this.state.data
      this.userFollowerInfo()       
      setDoc(doc(db,user.uid), {
          username: this.state.username,
          email:this.state.email,
          fullname:this.state.fullname,
          uid:user.uid,
          images:'',
          private_message:[],
          total_follow:0,
          total_follower:0,
          total_post:0,
        })
        .then(() => {
        this.setState({
        error:this.state.error = false,
        errorMessage:"Register sukses",
        hide:this.state.hide = true
      })
      alert("REGISTER SUKSES")
        })  
      .catch((err) => {alert(`something wrong ${err}`)})
      
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMsg = error.message;
        });
      
      }
      
      akunLogin = () => {
        this.setState({hide:this.state.hide = false})  
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const uid = user.uid
          this.setState({
            hide:this.state.hide = true,
            error:this.state.error = false
          })  
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMsg = error.message;
          this.setState({
            pesan:this.state.pesan = errorMsg,
            error:this.state.error = true
          })
        });
      }
        
createPost = (e) => {
  e.preventDefault()
  this.setState({modal:!this.state.modal})
  console.log(this.state.modal);
}
          
removeModal = (e) =>{
  e.preventDefault()
  this.setState({ modal:!this.state.modal})
}

logout = (e) => {
e.preventDefault()
auth.signOut();
}

      
registerValidasi = e => {
  e.preventDefault()

if(this.state.username.indexOf(' ') >= 0){
  alert("username cannot be whitespace");
}
else if (this.state.username.length < 8) {
  alert("Username atleast 8 character")
}
else if(this.state.fullname.length < 10){
  alert("Fullname atleast 12 character")
}
else if(this.state.email.length < 12){
alert("Email atleast 12 character")
}
else{
this.registerAkun() 
}
}

loginValidasi = (e) => {
e.preventDefault()
if(this.state.email.length < 1){
  alert("Username cant be empty")
}else if(this.state.password < 1){
  alert("Password cant be empty")
}else{
this.akunLogin() 
}
}
      render(){

        return(
<div className='App'>
<Router>
              <Header id={this.state.uid} createPost={this.createPost} logout={this.logout } isLogin={this.state.isLogin}   notif={this.state.notif}/>
    <Routes>
          <Route path="/" element={this.state.isLogin ? <PostPage id={this.state.uid} isLogin={this.state.isLogin}/> : <Home login={this.loginValidasi } avatar={this.state.akunImages} Post={this.state.totalPost} error={this.state.error} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/> }exact/>

          <Route path="/account/:id" element={this.state.isLogin ? <AccountPage id={this.state.uid} isLogin={this.state.isLogin} user_name={this.state.akunUserName} avatar={this.state.akunImages}/>  : <Home login={this.loginValidasi } avatar={this.state.akunImages} Post={this.state.totalPost} error={this.state.error} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/> }/>

          <Route path="/post-detail/:id" element={this.state.isLogin ? <PostDetail  ID={this.state.uid} avatar={this.state.akunImages} name={this.state.akunUserName} id={this.state.uid} isLogin={this.state.isLogin}/> : <Home login={this.loginValidasi } avatar={this.state.akunImages} Post={this.state.totalPost} error={this.state.error} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/> }/>

          <Route path="/category/:id" element={this.state.isLogin ? <PostCategory ID={this.state.uid} avatar={this.state.akunImages} name={this.state.akunUserName}/>  : <Home login={this.loginValidasi } avatar={this.state.akunImages} Post={this.state.totalPost} error={this.state.error} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/> }/>
          
          <Route path='*' element={<NotFound />} />

      </Routes>


<div className={this.state.modal ? 'modals' : "modal-container"}>
{this.state.modal ? <ModalPost removeModal={this.removeModal} Post={this.state.totalPost} id={this.state.uid} userName={this.state.akunUserName} images={this.state.akunImages} name={this.state.akunUserName} />  : ""}
<div className={this.state.modal ? 'close' : "hide"}>
<i class="fa fa-times" aria-hidden="true" onClick={this.removeModal}></i>
</div>
</div>
</Router>
            
</div>
             )
      }

}


export default App;


          // <Route path="/" element={this.state.isLogin ? <PostPage id={this.state.uid}/> : <Home login={this.akunLogin} avatar={this.state.akunImages} Post={this.state.totalPost} error={this.state.error} hide={this.state.hide} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/> }exact/>

          // <Route path="/account/:id" element={this.state.isLogin ? <AccountPage id={this.state.uid} isLogin={this.state.isLogin}/> : <Home login={this.akunLogin} error={this.state.error} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/>}/>

          // <Route path="/post-detail/:id" element={this.state.isLogin ? <PostDetail  ID={this.state.uid} avatar={this.state.akunImages} name={this.state.akunUserName}/> : <Home login={this.akunLogin} error={this.state.error} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/>}/>

          // <Route path="/category/:id" element={this.state.isLogin ? <PostCategory ID={this.state.uid} avatar={this.state.akunImages} name={this.state.akunUserName}/> : <Home login={this.akunLogin} error={this.state.error} pesan={this.state.pesan} registerAkun={this.registerValidasi} Change={this.handlerChange}/>}/>
          // <Route path='*' element={<NotFound />} />