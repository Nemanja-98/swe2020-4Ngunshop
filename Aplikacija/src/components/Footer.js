/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'

export function Footer() {
    return (
        <footer>
            <div className="zaprati">
                <p className="zapratii">
                    Možete nas zapratiti na:
                </p>
            </div>

            <div className="social-icon">
                <ul className="social-network">
                    <li><a href="https://www.facebook.com/" target="_blank" className="fa fa-facebook"></a></li>
                    <li><a href="https://www.youtube.com/" target="_blank" className="fa fa-youtube-play"></a></li>
                    <li><a href="https://www.instagram.com/" target="_blank" className="fa fa-instagram"></a></li>
                    <li><a href="https://www.gmail.com/" target="_blank" className="fa fa-google-plus"></a></li>
                </ul>
            </div>
            
            <div className="prava">
                © 4guNShop. Sva prava rezervisana.<br />
                Dizajnirano od strane 4N-Team-a
            </div>
        </footer>
    )
}
export default Footer