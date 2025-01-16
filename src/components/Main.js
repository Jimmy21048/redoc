import Header from './Header1';
import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <div className="main">
            <Header/>

            <div className="body">
                <div className="left">
                    <div className='hero-image'>
                        <div className="img1"></div>
                    </div>
                    <div className='hero-image hero-image2'>
                        <div className="img2"></div>
                    </div>
                </div>

                <div className="right">
                    <div>
                        <span className='redoc-title'><h1>Your research projects </h1> <h1>made easier</h1></span>
                        <p className="device-large">
                            A research and project management tool that caters for all your needs, all in one place. From 
                            project tracking -both individual and Collaborative, peer reviews, global interactions, sharing information to secure data storage,
                            Redoc is your best option.
                        </p>
                        <p className="device-small">A research and project management tool that caters for all your needs, all in one place. From 
                        project tracking -both individual and Collaborative, peer reviews, to global interactions</p>
                    </div>

                    <Link to="/socials" className="main-btn">EXPLORE</Link>
                </div>
            </div>
        </div>
    )
}

export default Main;