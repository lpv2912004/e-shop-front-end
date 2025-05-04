import React, { Component } from 'react'
import CartDetailComp from '../../../components/user/Cart/CartDetailComp'
import Navbar from '../../../components/user/Navbar/Navbar'
import {
    Collapse,
    Ripple,
    Input,
    initTWE
} from "tw-elements";
export default class CartDetail extends Component {
    componentDidMount() {
        initTWE({ Collapse, Ripple, Input }, { allowReinits: true });
    }
    render() {
        return (
            <div className='user-page bg-slate-100'>
                <Navbar />
                <CartDetailComp />
            </div>
        )
    }
}
