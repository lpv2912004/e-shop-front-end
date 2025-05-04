import React, { Component } from 'react'
import SearchProducts from '../../../components/user/SearchProducts/MainSearch'
import Navbar from '../../../components/user/Navbar/Navbar';
import Footer from '../../../components/user/Footer/Footer';
import {
    Tab,
    Modal,
    Ripple,
    Tooltip,
    Popover,
    initTWE,
} from "tw-elements";

export default class LayoutProfile extends Component {
    componentDidMount() {
        initTWE({ Tab, Modal, Ripple, Tooltip, Popover, initTWE });
    }
    render() {
        return (
            <>
                <Navbar />
                
                <div
                    className='user-page    text-white '
                >

                </div>
                <SearchProducts />
                <Footer />
            </>

        )
    }
}
