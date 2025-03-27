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
                        <span className='redoc-title'><h1>Write, Share, and</h1> <h1>Discover Ideas</h1></span>
                        <p className="device-large">
                        Express Your Thoughts, Share Your Knowledge, and Inspire the World - A Platform Where Every Article Finds Its Audience
                        </p>
                        <p className="device-small">Express Your Thoughts, Share Your Knowledge, and Inspire the World - A Platform Where Every Article Finds Its Audience</p>
                    </div>

                    <Link to="/socials" className="main-btn">EXPLORE</Link>
                </div>
            </div>
        </div>
    )
}

export default Main;