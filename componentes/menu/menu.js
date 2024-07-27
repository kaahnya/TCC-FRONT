import './css.css'

export default function Menu(){
    return(
        <div className='menu'> 
            <ul>
                <li><a href="/">REGISTER</a></li>
                <li><a href="/login">LOGIN</a></li>
                <li><a href="/users">USERS</a></li>
                <li><a href="/duvida">duvida</a></li>
            </ul>
        </div>
    )
}