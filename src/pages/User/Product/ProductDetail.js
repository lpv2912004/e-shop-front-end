import React, { Component } from 'react'
import ProdDetail from '../../../components/user/Item/ProdDetail'
import Navbar from '../../../components/user/Navbar/Navbar'
import Footer from '../../../components/user/Footer/Footer'
import {
    Ripple,
    Collapse,
    Input,
    initTWE,
} from "tw-elements";
export default class ProductDetail extends Component {
    componentDidMount() {
        initTWE({ Collapse, Input, Ripple }, { allowReinits: true });

    }
    render() {
        return (
            <div className=' user-page bg-slate-100'>
                <Navbar />
                <ProdDetail />
                <Footer/>
            </div>

        )
    }
}
