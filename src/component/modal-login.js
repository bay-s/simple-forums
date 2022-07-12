import React from 'react'
import {database,auth} from '../firebase';
import { signInWithEmailAndPassword,updateEmail  } from 'firebase/auth';
import {doc, updateDoc,} from 'firebase/firestore';

class ModalLogin extends React.Component{
    constructor(){
        super()
        this.state = {
            password:'',
            email:'',
            newEmail:'',
            hide:false
        }
    }

        
    handlerChange = (e) => {
        const {name,value} = e.target
        console.log(value);
        this.setState(prev => {
          return{
       [name]:value
          }
        })

      }

    akunLogin = (e) => {
        e.preventDefault()
        const id = this.props.id
        const docUpdate = doc(database,'user',id)
 
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const uid = user.uid
          alert("LOGIN SUKSES")
        updateDoc(docUpdate,{
            email:this.state.newEmail
        })
        updateEmail(auth.currentUser,this.state.newEmail).then(() => {
            // Email updated!
            // ...
            alert(" Email updated!")
          }).catch((error) => {
            // An error occurred
            // ...
            alert(error)
          });

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMsg = error.message;
alert(errorCode)
        });
      }

    render(){
        const styles = {
            margin:"-100px 0"
        }
        return(
<div className='modal-edit'>
    <div className='modal-inner' style={styles}>
            <div className='forms left'>
            <div className='judul-flex'>
            <h3 className='form-judul'>Login</h3>
            </div>
            <form className='form-grup left' onSubmit={this.akunLogin }>
         <label>
            Email
         <input type='email' name='email' onChange={this.handlerChange}/>   
         </label>
         <label>
            New Email
         <input type='email' name='newEmail' onChange={this.handlerChange}/>   
         </label>
         <label>
            Password
         <input type='password' name='password' onChange={this.handlerChange}/>
         </label>
        <label>
        <button type='submit' className={this.state.hide ? 'hide' : 'hvr-sweep-to-right'}>Save</button>
        </label>

            </form>
            </div>
            {/* END FORM */}
            </div>
            </div>
        )
    }
}

export default ModalLogin;