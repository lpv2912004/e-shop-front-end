import React, { Component } from "react";
import AdminLayout from "../../../components/admin/layout/AdminLayout";
import SlideMain from "../../../components/admin/Slide/SlideMain";

export default class Slide extends Component {
  render() {
    return (
      <AdminLayout>
        <SlideMain />
      </AdminLayout>
    );
  }
}
