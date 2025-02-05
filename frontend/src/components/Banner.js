import React from 'react'

export default function Banner() {
  return (
    <>
            <section className="banner_part">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-xl-5">
                            <div className="banner_text">
                                <div className="banner_text_iner">
                                    <h5>We are here for your care</h5>
                                    <h1>Best Care &
                                        Better Doctor</h1>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit sed do eiusmod tempor incididunt ut labore et dolore
                                        magna aliqua. Quis ipsum suspendisse ultrices gravida.Risus cmodo viverra </p>
                                    <a href="#" className="btn_2">Make an appointment</a>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="banner_img">
                                <img src="img/banner_img.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    </>
  )
}
