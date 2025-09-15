import { Link, NavLink } from 'react-router-dom'
import '../../CSS/Page1/footer.css'

const Footer = () => {
    return <footer className='footer'>
        <h2>
            <Link className='link' to={'/'}>Pixora</Link>
        </h2>
        <div className="social">
            <NavLink className={"icon insta"} to={'https://www.instagram.com/pixabay/'} target='_blank'>
                <i className="ri-instagram-fill"></i>
            </NavLink>
            <NavLink className={"icon pinterest"} to={'https://www.pinterest.com/pixabay/'} target='_blank'>
                <i className="ri-pinterest-fill"></i>
            </NavLink>
            <NavLink className={"icon twitter"} to={'https://x.com/pixabay'} target='_blank'>
                <i className="ri-twitter-x-fill"></i>
            </NavLink>
            <NavLink className={"icon fb"} to={'https://www.facebook.com/pixabay'} target='_blank'>
                <i className="ri-facebook-fill"></i>
            </NavLink>
        </div>
        <p>© 2025 Pixora. Built for educational use only.</p>
    </footer>
}

export default Footer