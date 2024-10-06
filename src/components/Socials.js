import Header from './Header1';
import Search from './Search';

const Socials=()=>{
    return(
        <div className='socials'>
            <Header/>
            <nav>
                <button>Science</button>
                <button>Medicine</button>
                <button>Mathematics</button>
                <button>Agriculture</button>
                <button>History</button>
            </nav>
            <Search />
        </div>
    )
}

export default Socials;