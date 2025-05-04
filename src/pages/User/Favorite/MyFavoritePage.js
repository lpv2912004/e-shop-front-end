import React, { Component } from 'react'
import MyFavorite from '../../../components/user/Item/MyFavorite'
import Navbar from '../../../components/user/Navbar/Navbar'
import Footer from '../../../components/user/Footer/Footer'
import {
    Modal,
    Ripple,
    Collapse,
    Input,
    Tooltip,
    Popover,
    initTWE,
} from "tw-elements";
export default class Checkout extends Component {
    componentDidMount() {
        initTWE({ Modal, Collapse, Input, Ripple, Tooltip, Popover }, { allowReinits: true });

    }
    render() {
        return (
            <>
                <Navbar />
                <MyFavorite />
                <Footer />
            </>

        )
    }
}
