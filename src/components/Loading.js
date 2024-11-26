import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
    return <div className='loading'>
        <DotLottieReact
            src="https://lottie.host/206d1169-3f5e-44e7-ae47-db37ec4d3c8b/KjnvVvFUKZ.lottie"
            loop
            autoplay
            speed={3}
            style={{width: '400px', height: '200px'}}
            backgroundColor='#F2F2F2'
        />
    </div>
}