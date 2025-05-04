import React, { Component } from 'react'
import ItemProfileComp from '../../../components/user/ProfileComp/ItemProfileComp'
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
            <div className='user-page mt-10 bg-slate-100'>
                <Navbar />
                <ItemProfileComp />
                <Footer/>
            </div>

        )
    }
}
