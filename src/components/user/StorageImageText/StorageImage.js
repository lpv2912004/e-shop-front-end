// import React, { useState, useEffect, Component } from 'react'
// import { storage } from './TxtImageConfig';
// import { listAll, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 } from 'uuid'
// import axios from "axios";

// class StorageImage extends Component {

//     async componentDidMount() {
//         let res = await axios.get("http://localhost:8080/api/products");
//         console.log(res);
//         this.setState({ listProduct: res ? res.data : [] });
//         console.log(this.state.listProduct);
//         this.fetchImageList();
//     }

//     constructor(props) {
//         super(props);
//         this.state = {
//             imageUpload: null,
//             imageList: [],
//             listProduct: []
//         };
//         this.imageListRef = ref(storage, "images/");
//         this.handleFileChange = this.handleFileChange.bind(this);
//         this.upLoadImage = this.upLoadImage.bind(this);
//         this.fetchImageList = this.fetchImageList.bind(this);
//     }


//     fetchImageList() {
//         listAll(this.imageListRef).then((response) => {
//             const fetchUrls = response.items.map((item) => getDownloadURL(item));
//             Promise.all(fetchUrls).then((urls) => {
//                 this.setState({ imageList: urls });
//             });
//         });
//     }

//     handleFileChange(event) {
//         this.setState({
//             imageUpload: event.target.files[0]
//         });
//     }

//     upLoadImage() {
//         const { imageUpload } = this.state;
//         if (imageUpload == null) {
//             return; 
//         } else {
//             const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
//             uploadBytes(imageRef, imageUpload).then(() => {
//                 alert('Upload successful');
//                 this.fetchImageList(); // Re-fetch the image list after upload
//             });
//         }
//     }

//     render() {
//         const { imageList, listProduct } = this.state;
//         return (
//             <>
//                 <div>
//                     <input type='file' onChange={this.handleFileChange} />
//                     <button className='bg-black text-white' onClick={this.upLoadImage}>Up</button>
//                 </div>
//                 {listProduct.map((product, index) => (
//                     <img className='w-52 h-auto' key={index} src={product.image_prod} alt='uploaded' />
//                 ))}
//             </>
//         );
//     }
// }

// export default StorageImage;

