import React, { Component } from 'react'
import SupportComp from '../../../components/user/Support/Support'
import Navbar from '../../../components/user/Navbar/Navbar'
import Footer from '../../../components/user/Footer/Footer';
import {
    Collapse,
    Ripple,
    Input,
    initTWE
} from "tw-elements";
export default class Support extends Component {
    componentDidMount() {
        initTWE({ Collapse, Ripple, Input }, { allowReinits: true });
    }
    render() {
        return (
            <>
                <Navbar />
                <SupportComp />
                <Footer/>
            </>
        )
    }
}
