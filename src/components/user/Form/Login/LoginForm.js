import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
    signInWithGoogle,
    signInWithFacebook,
} from "../../StorageImageText/TxtImageConfig";



class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            rememberMe: false,
            error: "",
            isLoading: false,
        };
    }

    handleInputChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    handleCheckboxChange = () => {
        this.setState((prevState) => ({ rememberMe: !prevState.rememberMe }));
    };

    componentDidMount() {
        const jwt = localStorage.getItem("jwtToken");
        if (jwt) {
            window.location.href = "http://localhost:3000/home";
        }
    }

    // handleSubmit = async (event) => {
    //     event.preventDefault();
    //     const { username, password } = this.state;

    //     if (!username || !password) {
    //         toast("Không được để trống!", {
    //             type: 'error',
    //             position: 'top-right',
    //             duration: 3000,
    //             closeButton: true,
    //             richColors: true
    //         })
    //         return;
    //     }

    //     try {
    //         const response = await axios.post('http://localhost:8080/api/v1/login', { username, password });
    //         const { jwt } = response.data;

    //         // Lưu token vào localStorage
    //         localStorage.setItem('jwtToken', jwt);

    //         // Giải mã token để lấy thông tin quyền
    //         const decoded = jwtDecode(jwt);

    //         // Kiểm tra xem người dùng có phải là ADMIN không
    //         const isAdmin = decoded.Role.some(role => role.authority === "ROLE_ADMIN");
    //         let { id, tokenDevice } = ""

    //         if (await isAdmin) {
    //             id = decoded.id_user
    //             tokenDevice = sessionStorage.getItem("FCMToken")

    //             await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
    //                 {
    //                     headers: {
    //                         'Authorization': `Bearer ${jwt}`
    //                     }
    //                 }
    //             )
    //                 .then(response => {
    //                     window.location.href = 'http://localhost:3000/admin/dashboard';
    //                 })
    //         } else {
    //             id = decoded.id_user
    //             tokenDevice = sessionStorage.getItem("FCMToken")

    //             await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
    //                 {
    //                     headers: {
    //                         'Authorization': `Bearer ${jwt}`
    //                     }
    //                 }
    //             )
    //                 .then(response => {
    //                     if(response.status === 401) {
    //                         toast(response.data, {
    //                             type: 'error',
    //                             position: 'top-right',
    //                             duration: 3000,
    //                             closeButton: true,
    //                             richColors: true
    //                         })
    //                     }
    //                     window.location.href = 'http://localhost:3000/home'
    //                 })
    //         }

    //     } catch (error) {
    //         toast("Tài khoản hoặc mật khẩu không chính xác", {
    //             type: 'error',
    //             position: 'top-right',
    //             duration: 3000,
    //             closeButton: true,
    //             richColors: true
    //         })
    //     }
    // };


    // handleSubmit = async (event) => {
    //     event.preventDefault();
    //     const { username, password } = this.state;

    //     if (!username || !password) {
    //         toast("Không được để trống!", {
    //                         type: 'error',
    //                         position: 'top-right',
    //                         duration: 3000,
    //                         closeButton: true,
    //                         richColors: true
    //                     })
    //         // toast.error("Không được để trống!");
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(
    //             "http://localhost:8080/api/v1/login",
    //             { username, password }
    //         );
    //         const { jwt, message } = response.data;

    //         // Kiểm tra nếu tài khoản bị vô hiệu
    //         if (message === "Tài khoản của bạn đã bị vô hiệu hóa.") {
    //             toast(message, {
    //                             type: 'error',
    //                             position: 'top-right',
    //                             duration: 3000,
    //                             closeButton: true,
    //                             richColors: true
    //                         })
    //             // toast.error(message);
    //             return;
    //         }

    //         // Lưu token vào localStorage
    //         localStorage.setItem("jwtToken", jwt);

    //         // Giải mã token để lấy thông tin quyền
    //         const decoded = jwtDecode(jwt);

    //         // Kiểm tra xem người dùng có phải là ADMIN không
    //         const isAdmin = decoded.Role.some(
    //             (role) => role.authority === "ROLE_ADMIN"
    //         );
    //         let { id, tokenDevice } = "";

    //         if (await isAdmin) {
    //             id = decoded.id_user;
    //             tokenDevice = sessionStorage.getItem("FCMToken");
    //             console.log(id, tokenDevice);

    //             await axios
    //                 .post(
    //                     "http://localhost:8080/user/api/notify/checkTokenDevice",
    //                     { id, tokenDevice },
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${jwt}`,
    //                         },
    //                     }
    //                 )
    //                 .then((response) => {
    //                     window.location.href = "http://localhost:3000/admin/dashboard";
    //                     console.log(response.data);
    //                 });
    //         } else {
    //             id = decoded.id_user;
    //             tokenDevice = sessionStorage.getItem("FCMToken");
    //             console.log(id, tokenDevice);

    //             await axios
    //                 .post(
    //                     "http://localhost:8080/user/api/notify/checkTokenDevice",
    //                     { id, tokenDevice },
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${jwt}`,
    //                         },
    //                     }
    //                 )
    //                 .then((response) => {
    //                     window.location.href = "http://localhost:3000/home";
    //                     console.log(response.data);
    //                 });
    //         }
    //     } catch (error) {
    //         if (error.response && error.response.status === 401) {
    //             toast("Tài khoản của bạn đã bị vô hiệu hóa.", {
    //                 type: 'error',
    //                 position: 'top-right',
    //                 duration: 3000,
    //                 closeButton: true,
    //                 richColors: true
    //             })

    //         } else {
    //             toast("Tài khoản hoặc mật khẩu không chính xác.", {
    //                 type: 'error',
    //                 position: 'top-right',
    //                 duration: 3000,
    //                 closeButton: true,
    //                 richColors: true
    //             })
    //         }
    //     }
    // };


    handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;

        if (!username || !password) {
            toast("Không được để trống!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error("Không được để trống!");
            return;
        }

        // Bắt đầu loading
        this.setState({ isLoading: true });

        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/login",
                { username, password }
            );
            const { jwt, message } = response.data;

            if (message === "Tài khoản của bạn đã bị vô hiệu hóa.") {
                toast(message, {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                // toast.error(message);
                this.setState({ isLoading: false });
                return;
            }

            localStorage.setItem("jwtToken", jwt);

            const decoded = jwtDecode(jwt);
            const isAdmin = decoded.Role.some(
                (role) => role.authority === "ROLE_ADMIN"
            );

            const id = decoded.id_user;
            const tokenDevice = sessionStorage.getItem("FCMToken");

            await axios.post(
                "http://localhost:8080/user/api/notify/checkTokenDevice",
                { id, tokenDevice },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );

            // Điều hướng dựa vào quyền
            const redirectUrl = isAdmin
                ? "http://localhost:3000/admin/dashboard"
                : "http://localhost:3000/home";

            window.location.href = redirectUrl;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast("Tài khoản của bạn đã bị vô hiệu hóa.", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
            } else {
                toast("Tài khoản hoặc mật khẩu không chính xác.", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                // toast.error("Tài khoản hoặc mật khẩu không chính xác.");
            }
        } finally {
            // Kết thúc loading
            this.setState({ isLoading: false });
        }
    };

    // handleGoogleLogin = async () => {
    //     try {
    //         const result = await signInWithGoogle();
    //         if (result && result.user) {
    //             const user = result.user;
    //             const idToken = await user.getIdToken();

    //             // Gửi idToken đến API backend để nhận JWT
    //             const response = await axios.post(
    //                 "http://localhost:8080/api/v1/google-login",
    //                 idToken,
    //                 {
    //                     headers: {
    //                         "Content-Type": "text/plain",
    //                     },
    //                 }
    //             );

    //             if (response.status === 200 && response.data.jwt) {
    //                 const { jwt } = response.data;
    //                 localStorage.setItem("jwtToken", jwt);

    //                 //---------------------------------------------------------------------
    //                 // Giải mã token để lấy thông tin quyền
    //                 const decoded = jwtDecode(jwt);
    //                 // Kiểm tra xem người dùng có phải là ADMIN không
    //                 const isAdmin = decoded.Role
    //                 let { id, tokenDevice } = ""

    //                 if (isAdmin === "ROLE_ADMIN") {
    //                     id = decoded.id_user
    //                     tokenDevice = sessionStorage.getItem("FCMToken")

    //                     await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
    //                         {
    //                             headers: {
    //                                 'Authorization': `Bearer ${jwt}`
    //                             }
    //                         }
    //                     )
    //                         .then(response => {
    //                             window.location.href = 'http://localhost:3000/admin/dashboard';
    //                         })
    //                 } else {
    //                     id = decoded.id_user
    //                     tokenDevice = sessionStorage.getItem("FCMToken")

    //                     await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
    //                         {
    //                             headers: {
    //                                 'Authorization': `Bearer ${jwt}`
    //                             }
    //                         }
    //                     )
    //                         .then(response => {
    //                             window.location.href = 'http://localhost:3000/home'
    //                         })
    //                 }
    //                 //---------------------------------------------------------------------

    //                 //window.location.href = "http://localhost:3000/home";
    //             } else {
    //                 toast("Đăng nhập bằng Google thất bại", {
    //                     type: 'error',
    //                     position: 'top-right',
    //                     duration: 3000,
    //                     closeButton: true,
    //                     richColors: true
    //                 })
    //                 console.error("Failed to retrieve JWT from API");
    //             }
    //         } else {
    //             console.error("User not found in sign-in result");
    //             toast("Đăng nhập bằng Google thất bại", {
    //                 type: 'error',
    //                 position: 'top-right',
    //                 duration: 3000,
    //                 closeButton: true,
    //                 richColors: true
    //             })
    //         }
    //     } catch (error) {
    //         console.error("Error during Google sign-in:", error);
    //         toast("Đăng nhập bằng Google thất bại", {
    //             type: 'error',
    //             position: 'top-right',
    //             duration: 3000,
    //             closeButton: true,
    //             richColors: true
    //         })
    //     }
    // };

    // handleFacebookLogin = async () => {
    //     try {
    //         const result = await signInWithFacebook();
    //         if (result && result.user) {
    //             const facebookAccessToken = result._tokenResponse.oauthAccessToken; // Lấy oauthAccessToken thay vì idToken

    //             console.log("Facebook Access Token:", facebookAccessToken); // Đảm bảo rằng bạn đang sử dụng token đúng

    //             // Gửi facebookAccessToken tới API backend để lấy JWT
    //             const response = await axios.post(
    //                 "http://localhost:8080/api/v1/facebook-login",
    //                 facebookAccessToken,  // Gửi oauthAccessToken thay vì idToken
    //                 {
    //                     headers: {
    //                         "Content-Type": "text/plain",
    //                     },
    //                 }
    //             );

    //             if (response.status === 200 && response.data.jwt) {
    //                 const { jwt } = response.data;
    //                 localStorage.setItem("jwtToken", jwt);
    //                 //---------------------------------------------------------------------
    //                 // Giải mã token để lấy thông tin quyền
    //                 const decoded = jwtDecode(jwt);

    //                 // Kiểm tra xem người dùng có phải là ADMIN không
    //                 const isAdmin = decoded.Role
    //                 //decoded.Role.some(role => role.authority === "ROLE_ADMIN");
    //                 let { id, tokenDevice } = ""

    //                 if (isAdmin === "ROLE_ADMIN") {
    //                     id = decoded.id_user
    //                     tokenDevice = sessionStorage.getItem("FCMToken")
    //                     console.log(id, tokenDevice)

    //                     await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
    //                         {
    //                             headers: {
    //                                 'Authorization': `Bearer ${jwt}`
    //                             }
    //                         }
    //                     )
    //                         .then(response => {
    //                             window.location.href = 'http://localhost:3000/admin/dashboard';
    //                             console.log(response.data)
    //                         })
    //                 } else {
    //                     id = decoded.id_user
    //                     tokenDevice = sessionStorage.getItem("FCMToken")
    //                     console.log(id, tokenDevice)

    //                     await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
    //                         {
    //                             headers: {
    //                                 'Authorization': `Bearer ${jwt}`
    //                             }
    //                         }
    //                     )
    //                         .then(response => {
    //                             window.location.href = 'http://localhost:3000/home'
    //                             console.log(response.data)
    //                         })
    //                 }
    //                 //---------------------------------------------------------------------
    //                 // window.location.href = "http://localhost:3000/home";
    //             } else {
    //                 console.error("Failed to retrieve JWT from API");
    //                 toast.error("Đăng nhập bằng Facebook thất bại");
    //             }
    //         } else {
    //             console.error("User not found in sign-in result");
    //             toast.error("Đăng nhập bằng Facebook thất bại");
    //         }
    //     } catch (error) {
    //         console.error("Error during Facebook sign-in:", error);
    //         toast.error("Đăng nhập bằng Facebook thất bại vì Email đã được đăng nhập bởi phương thức khác ngoài Facebook!");
    //     }
    // };

    handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            if (result && result.user) {
                const user = result.user;
                const idToken = await user.getIdToken();
    
                // Gửi idToken đến API backend để nhận JWT
                const response = await axios.post(
                    "http://localhost:8080/api/v1/google-login",
                    idToken,
                    {
                        headers: {
                            "Content-Type": "text/plain",
                        },
                    }
                );
    
                if (response.status === 200 && response.data.jwt) {
                    const { jwt } = response.data;
                    localStorage.setItem("jwtToken", jwt);
    
                    // Giải mã token để lấy thông tin quyền
                    const decoded = jwtDecode(jwt);
                    console.log("Decoded JWT: ", decoded);
    
                    const isAdmin = decoded.Role;
                    let { id, tokenDevice } = "";
    
                    if (isAdmin === "ROLE_ADMIN") {
                        id = decoded.id_user;
                        tokenDevice = sessionStorage.getItem("FCMToken");
    
                        await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
                            {
                                headers: {
                                    'Authorization': `Bearer ${jwt}`
                                }
                            })
                            .then(response => {
                                window.location.href = 'http://localhost:3000/admin/dashboard';
                                console.log(response.data);
                            })
                            .catch(err => {
                                console.error("Error with checkTokenDevice for admin:", err);
                                toast.error("Đã có lỗi xảy ra");
                            });
                    } else {
                        id = decoded.id_user;
                        tokenDevice = sessionStorage.getItem("FCMToken");
    
                        await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
                            {
                                headers: {
                                    'Authorization': `Bearer ${jwt}`
                                }
                            })
                            .then(response => {
                                window.location.href = 'http://localhost:3000/home';
                                console.log(response.data);
                            })
                            .catch(err => {
                                console.error("Error with checkTokenDevice for user:", err);
                                toast.error("Đã có lỗi xảy ra");
                            });
                    }
                }  else {
                    console.error("Failed to retrieve JWT from API");
                    toast.error("Đăng nhập bằng Google thất bại");
                }
            } else {
                console.error("User not found in sign-in result");
                toast.error("Đăng nhập bằng Google thất bại");
            }
        } catch (error) {
            if(error.response){
                if(error.response.status ===401)
                    toast.error("Tài khoản của bạn đã bị vô hiệu hóa.");
            }else{
                console.error("Error during Google sign-in:", error);
                toast.error("Đăng nhập bằng Google thất bại");
            }
            
          
        }
    };


    handleFacebookLogin = async () => {
        try {
            const result = await signInWithFacebook();
            if (result && result.user) {
                const facebookAccessToken = result._tokenResponse.oauthAccessToken;
    
                // Gửi facebookAccessToken tới API backend để lấy JWT
                const response = await axios.post(
                    "http://localhost:8080/api/v1/facebook-login",
                    facebookAccessToken,
                    {
                        headers: {
                            "Content-Type": "text/plain",
                        },
                    }
                );
    
                if (response.status === 200 && response.data.jwt) {
                    const { jwt } = response.data;
                    localStorage.setItem("jwtToken", jwt);
    
                    // Giải mã token để lấy thông tin quyền
                    const decoded = jwtDecode(jwt);
    
                    const isAdmin = decoded.Role;
                    let { id, tokenDevice } = "";
    
                    if (isAdmin === "ROLE_ADMIN") {
                        id = decoded.id_user;
                        tokenDevice = sessionStorage.getItem("FCMToken");
    
                        await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
                            {
                                headers: {
                                    'Authorization': `Bearer ${jwt}`
                                }
                            })
                            .then(response => {
                                window.location.href = 'http://localhost:3000/admin/dashboard';
                                console.log(response.data);
                            })
                            .catch(err => {
                                console.error("Error with checkTokenDevice for admin:", err);
                                toast.error("Đã có lỗi xảy ra");
                            });
                    } else {
                        id = decoded.id_user;
                        tokenDevice = sessionStorage.getItem("FCMToken");
    
                        await axios.post('http://localhost:8080/user/api/notify/checkTokenDevice', { id, tokenDevice },
                            {
                                headers: {
                                    'Authorization': `Bearer ${jwt}`
                                }
                            })
                            .then(response => {
                                window.location.href = 'http://localhost:3000/home';
                                console.log(response.data);
                            })
                            .catch(err => {
                                console.error("Error with checkTokenDevice for user:", err);
                                toast.error("Đã có lỗi xảy ra");
                            });
                    }
                } else {
                    console.error("Failed to retrieve JWT from API");
                    toast.error("Đăng nhập bằng Facebook thất bại");
                }
            } else {
                console.error("User not found in sign-in result");
                toast.error("Đăng nhập bằng Facebook thất bại");
            }
        } catch (error) {
            if(error.response){
                if(error.response.status ===401)
                    toast.error("Tài khoản của bạn đã bị vô hiệu hóa.");
            }else{
                console.error("Error during Facebook sign-in:", error);
                toast.error("Đăng nhập bằng Facebook thất bại");
            }
            
          
        }
    };
    
    render() {
        const { username, password, rememberMe } = this.state;
        const isDisabled = !username || !password;

        return (
            <>
                <div>
                    <Toaster position="top-right" reverseOrder={false} />
                </div>
                <form onSubmit={this.handleSubmit} className="max-w-md mx-auto p-6">
                    <h2 className="text-center text-2xl font-semibold mb-6">
                        Đăng Nhập 
                    </h2>

                    <div className="mb-4">
                        <input
                            type="text"
                            id="username"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={this.handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={this.handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-gray-700">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={this.handleCheckboxChange}
                                className="mr-2"
                            />
                            Ghi nhớ tài khoản
                        </label>
                        <Link to="/forgot" className="text-blue-500">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* <button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-full py-2 mb-4 text-white font-semibold rounded ${isDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-500 hover:bg-gray-600"
                            }`}
                    >
                        Đăng nhập
                    </button> */}
                    <button
                        type="submit"
                        disabled={this.state.isLoading} // Vô hiệu hóa khi đang tải
                        className={`w-full py-2 mb-4 text-white font-semibold rounded ${this.state.isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gray-500 hover:bg-gray-600"
                            }`}
                    >
                        {this.state.isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                                    ></path>
                                </svg>
                                <span className="ml-2">Đang xử lý...</span>
                            </div>
                        ) : (
                            "Đăng nhập"
                        )}
                    </button>

                    <div className="flex items-center justify-center my-4">
                        <div className="border-t w-1/3"></div>
                        <p className="mx-2 text-gray-500">or</p>
                        <div className="border-t w-1/3"></div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={this.handleGoogleLogin}
                            className="flex items-center justify-center w-full py-2 border rounded text-gray-600 bg-white hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                            Đăng nhập bằng Google
                        </button>

                        <button
                            type="button"
                            onClick={this.handleFacebookLogin}
                            className="flex items-center justify-center w-full py-2 border rounded text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                            Đăng nhập bằng Facebook
                        </button>
                    </div>

                    <p className="mt-4 text-center">
                        Chưa có tài khoản?
                        <Link to="/emailRG" className="text-blue-500 ml-1">
                            Đăng ký
                        </Link>
                    </p>
                </form>
            </>
        );
    }
}

export default withRouter(LoginForm);
