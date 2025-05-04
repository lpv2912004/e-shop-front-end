// import React, { Component } from "react";
// import axios from "axios";

// export default class Carous extends Component {
//   state = {
//     slides: [], // Lưu danh sách slide
//     currentIndex: 0, // Slide hiện tại
//   };

//   componentDidMount() {
//     this.fetchSlides();
//     this.autoSlide(); // Tự động chuyển slide
//   }

//   componentWillUnmount() {
//     clearInterval(this.autoSlideInterval); // Xóa interval khi unmount
//   }

//   fetchSlides = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/auth/all-slide");
//       this.setState({ slides: response.data });
//     } catch (error) {
//       console.error("Lỗi khi tải danh sách slide:", error);
//     }
//   };

//   autoSlide = () => {
//     this.autoSlideInterval = setInterval(() => {
//       this.setState((prevState) => ({
//         currentIndex: (prevState.currentIndex + 1) % prevState.slides.length,
//       }));
//     }, 5000); // Chuyển slide mỗi 5 giây
//   };

//   handleNext = () => {
//     this.setState((prevState) => ({
//       currentIndex: (prevState.currentIndex + 1) % prevState.slides.length,
//     }));
//   };

//   handlePrev = () => {
//     this.setState((prevState) => ({
//       currentIndex:
//         prevState.currentIndex === 0
//           ? prevState.slides.length - 1
//           : prevState.currentIndex - 1,
//     }));
//   };

//   render() {
//     const { slides, currentIndex } = this.state;

//     return (
//       <div className="relative w-full h-screen overflow-hidden  md:grid-cols-4 gap-x-2 gap-y-2 mx-auto max-w-7xl px-4 sm:px-2 ">
//         {/* Carousel Items */}
//         <div className="relative w-full h-full">
//           {slides.map((slide, index) => (
//             <div
//               key={slide.id}
//               className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out ${
//                 index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
//               }`}
//               style={{
//                 backgroundImage: `url(${slide.image_SlideShow})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             ></div>
//           ))}
//         </div>

//         {/* Carousel Controls */}
//         <button
//           className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
//           onClick={this.handlePrev}
//         >
//           &#10094;
//         </button>
//         <button
//           className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
//           onClick={this.handleNext}
//         >
//           &#10095;
//         </button>
//       </div>
//     );
//   }
// }

import React, { Component } from "react";
import axios from "axios";

export default class Carous extends Component {
  state = {
    slides: [], // Danh sách các slide
    currentIndex: 0, // Slide hiện tại
  };

  componentDidMount() {
    this.fetchSlides();
    this.autoSlide();
  }

  fetchSlides = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/all-slide");
      this.setState({ slides: response.data });
    } catch (error) {
      console.error("Lỗi khi tải danh sách slide:", error);
    }
  };

  autoSlide = () => {
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        currentIndex: (prevState.currentIndex + 1) % prevState.slides.length,
      }));
    }, 3000); // Tự động chuyển slide sau 3 giây
  };

  componentWillUnmount() {
    clearInterval(this.interval); // Dừng auto-slide khi component bị unmount
  }

  render() {
    const { slides, currentIndex } = this.state;

    return (
      <div
        id="carouselExampleCaptions"
        className="relative mx-auto max-w-7xl px-4 sm:px-2"
      >
        {/* Carousel Items */}
        <div className="relative w-full overflow-hidden">
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <div
                key={index}
                className={`${
                  index === currentIndex ? "block" : "hidden"
                } w-full transition-transform duration-500 ease-in-out`}
              >
                <img
                  src={slide.image_SlideShow}
                  alt={slide.title || `Slide ${index + 1}`}
                  className="block w-full object-cover"
                />
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] mx-auto mb-4 flex list-none justify-center p-0">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`mx-2 h-3 w-3 rounded-full ${
                currentIndex === index ? "" : "bg-gray-300"
              }`}
              onClick={() => this.setState({ currentIndex: index })}
            />
          ))}
        </div>

        {/* Controls */}
        <button
          className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center text-white"
          onClick={() =>
            this.setState((prevState) => ({
              currentIndex:
                (prevState.currentIndex - 1 + slides.length) % slides.length,
            }))
          }
        >
          
        </button>
        <button
          className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center text-white"
          onClick={() =>
            this.setState((prevState) => ({
              currentIndex: (prevState.currentIndex + 1) % slides.length,
            }))
          }
        >
          
        </button>
      </div>
    );
  }
}

