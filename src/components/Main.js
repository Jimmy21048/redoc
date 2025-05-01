import Header from './Header1';
import { Link } from 'react-router-dom';
import styles from '../css/Main.module.css'

const Main = () => {
    return (
        <div className={ styles.main }>
            <Header transparentBg={true} />

            <div className={ styles.body }>
                <div className={ styles.left }>
                    <div className={ styles.heroImage }>
                        <div className={ styles.img1 }></div>
                    </div>
                    <div className={`${styles.heroImage} ${styles.heroImage2}`}>
                        <div className={ styles.img2 }></div>
                    </div>
                </div>

                <div className={ styles.right }>
                    <div>
                        <span className={ styles.redocTitle }><h1>Write, Share, and</h1> <h1>Discover Ideas</h1></span>
                        <p className={ styles.deviceLarge }>
                        Express Your Thoughts, Share Your Knowledge, and Inspire the World - A Platform Where Every Article Finds Its Audience
                        </p>
                        <p className={ styles.deviceSmall }>Express Your Thoughts, Share Your Knowledge, and Inspire the World - A Platform Where Every Article Finds Its Audience</p>
                    </div>

                    <Link to="/socials" className={ styles.mainBtn }>EXPLORE</Link>
                </div>
            </div>
        </div>
    )
}

export default Main;