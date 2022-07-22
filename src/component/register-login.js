import React from 'react'

class Home extends React.Component{
    constructor(){
        super()
        this.state = {
        index:0
        }
    }

    nextSlide = (e) => {
        e.preventDefault();
        this.setState({ index: (this.state.index = this.state.index + 1) });
      };
    
      prevSlide = (e) => {
        e.preventDefault();
        this.setState({ index: (this.state.index = this.state.index - 1) });
      };
    
testSubmit = e => {
    e.preventDefault()
    console.log("TEST SUBMIT");
}


    render(){

        const styles = {
            transform:`translateX(-${this.state.index * 100}%)`,
        }

        return(
            <div className='home-container'>
                <div className='form-wrapper'>
                    <div className='forms left'>
                    <div className='judul-flex'>
                    <h3 className='form-judul'>Login</h3>
                    <i class="fa fa-long-arrow-right rights" aria-hidden="true" onClick={this.nextSlide}></i>
                    </div>
                    <form className='form-grup left' onSubmit={this.props.login}>
                 <label>
                    Email
                 <input type='email' name='email' onChange={this.props.Change}/>   
                 </label>
                 <label>
                    Password
                 <input type='password' name='password' onChange={this.props.Change}/>
                 </label>
                <label>
                <button type='submit' className='hvr-sweep-to-right'>Login</button>
                </label>
                <div className={this.props.error ? 'pesan' : 'hide'}>
                    <p className='error'>{this.props.pesan}</p>
                </div>
                    </form>
                    </div>
                    <div className='forms right' style={styles}>
                    <div className='judul-flex'>
                    <h3 className='form-judul'>Register</h3>
                    <i class="fa fa-long-arrow-left lefts" aria-hidden="true" onClick={this.prevSlide}></i>
                    </div>
                        <form className='form-grup right' onSubmit={this.props.registerAkun}>
                        <label>
                        Full name
                        <input type='text' name='fullname' onChange={this.props.Change}/>   
                        </label>
                      <label>
                        Username
                      <input type='text' name='username' onChange={this.props.Change}/>   
                      </label>
                     <label>
                        Email
                     <input type='email' name='email' onChange={this.props.Change}/>   
                     </label>
                     <label>
                        Password
                     <input type='password' name='password' onChange={this.props.Change}/>
                     </label>
               <label>
               {this.props.load ?  <button type='submit' className='hvr-sweep-to-right'>Register</button> : <button className='disabled'  disabled>Register</button> }
               </label>
                <div className={this.props.error ? 'pesan' : 'hide'}>
                    <p className='error'>{this.props.pesan}</p>
                </div>
                <div className={this.props.sukses ? 'pesan' : 'hide'}>
                    <p className='sukses'>{this.props.pesan}</p>
                </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    } 
}

export default Home;

