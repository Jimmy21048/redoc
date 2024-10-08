import Header from './Header1';
import Search from './Search';
import axios from 'axios'

const Socials=()=>{

    axios.get('http://localhost:3001/socials')
    
    return(
        <div className='socials'>
            <Header/>
            <nav>
                <button>Science</button>
                <button>Medicine</button>
                <button>Mathematics</button>
                <button>Agriculture</button>
                <button>History</button>
                <Search />
            </nav>
            <div className='socials-body'>

            </div>
            
        </div>
    )
}

export default Socials;