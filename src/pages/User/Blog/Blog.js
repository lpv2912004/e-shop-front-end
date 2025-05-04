import React, { Component } from 'react'
import BologComp from '../../../components/user/Blog/Blog'
import Navbar from '../../../components/user/Navbar/Navbar'
import Footer from '../../../components/user/Footer/Footer';
import {
    Collapse,
    Ripple,
    Input,
    initTWE
} from "tw-elements";
export default class Blog extends Component {
    componentDidMount() {
        initTWE({ Collapse, Ripple, Input }, { allowReinits: true });
    }
    render() {
        return (
            <>
                <Navbar />
                <BologComp />
                <Footer />
            </>
        )
    }
}
