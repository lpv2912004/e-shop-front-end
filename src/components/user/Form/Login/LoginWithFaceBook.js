import React, { Component } from 'react'

export default class LoginWithFaceBook extends Component {
    render() {
        return (
            <button
                type="button"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                class=" mx-1 inline-block h-9 w-9 rounded-full bg-black fill-white p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                {/* <!-- Facebook --> */}
                <span class="[&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512">
                        {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. --> */}
                        <path
                            d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                    </svg>
                </span>
            </button>
        )
    }
}
