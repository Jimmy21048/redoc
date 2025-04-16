import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from '../css/Header.module.css'

export default function Loading() {
    return <div className={ styles.loading }>
        <div className={ styles.loader }></div>
    </div>
}