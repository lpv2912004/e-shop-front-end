import React, { Component } from 'react'
import DangkyComp from '../../../components/user/Form/Register/DangkyComp'

export default class dangky extends Component {
  render() {
    return (
      <>
      <section class="h-screen">
          <div class="h-full">
            {/* <!-- Left column container with background--> */}
            <div class="flex p-10 rounded-xl h-full flex-wrap items-center justify-center lg:justify-between">
              <div class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                <img
                  src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  class="w-full"
                  alt=""
                />
              </div>

              {/* <!-- Right column container --> */}
              <div class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                <DangkyComp />
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
}