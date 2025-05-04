import React, { Component } from 'react'
import LoginForm from '../../../components/user/Form/Login/LoginForm';

// Initialization for ES Users

import {
    Input,
    Ripple,
    initTWE,
} from "tw-elements";

initTWE({ Input, Ripple });
export default class Login extends Component {
    componentDidMount() {
        initTWE({ Input, Ripple }, { allowReinits: true });
    }
    render() {
        return (
            <>
                <section class="h-screen">

                    <div class="h-full">
                        {/* <!-- Left column container with background--> */}
                        
                        <div
                            class="flex p-10 rounded-xl h-full flex-wrap items-center justify-center lg:justify-between">
                            
                                <div
                                    class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                                    <img
                                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                                        class="w-full"
                                        alt=""
                                    />
                                </div>
                            
                            {/* <!-- Right column container --> */}
                            <div class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                                <LoginForm />
                            </div>
                        </div>
                    </div>

                </section>

            </>
        )
    }
}
