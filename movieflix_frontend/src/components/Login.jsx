import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import FloatingLabelInput from "../utils/FloatingLabelInput";
import bg from "../assets/images/bg.jpg";
import Checkbox from "@mui/joy/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import { firebaseAuth, db } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import {
  getDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import Cookies from "js-cookie";
import { useAuth } from "../utils/AuthContext";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoCloseCircleSharp } from "react-icons/io5";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [textVisible, setTextVisible] = useState(false);
  const bgImageRef = useRef(null);
  const labelRefs = useRef([]); // Create an array of refs
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // Prevent the default behavior of form submission
    setPasswordVisible((passwordVisible) => !passwordVisible);
  };

  // eslint-disable-next-line no-unused-vars
  const [footerStyles, setFooterStyles] = useState({
    top: "657px",
    height: "424px",
  });

  const infoIcon = <BsFillInfoCircleFill style={{ fontSize: "30px" }} />;
  const dismissIcon = <IoCloseCircleSharp style={{ fontSize: "25px" }} />;

  const adjustFooterPosition = () => {
    if (bgImageRef.current) {
      const bgImageHeight = bgImageRef.current.clientHeight;
      const windowHeight = window.innerHeight;

      const footerTop = Math.max(bgImageHeight, windowHeight - 424);

      let footerHeight = 424;
      if (footerTop < 657) {
        footerHeight = windowHeight + footerTop;
      }

      setFooterStyles({
        top: `${footerTop}px`,
        height: `${footerHeight}px`,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", adjustFooterPosition);
    adjustFooterPosition(); // Initial call to set footer position

    return () => {
      window.removeEventListener("resize", adjustFooterPosition);
    };
  }, []);

  useEffect(() => {
    labelRefs.current.forEach((label) => {
      if (label) {
        const handleMouseOver = () => {
          label.style.cursor = "pointer";
        };
        label.addEventListener("mouseover", handleMouseOver);
        return () => {
          label.removeEventListener("mouseover", handleMouseOver);
        };
      }
    });
  }, []);

  const handleRememberMe = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
  };

  const formatFirebaseError = (error) => {
    if (error && error.code) {
      let errorMessage;
      switch (error.code) {
        case "auth/email-already-exists":
          errorMessage = "User already exists .";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/user-disabled":
          errorMessage = "This user account has been disabled.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many failed login attempts. Please try again later.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Operation not allowed. Please contact support.";
          break;
        case "auth/expired-action-code":
          errorMessage =
            "The action code has expired. Please request a new one.";
          break;
        case "auth/invalid-action-code":
          errorMessage =
            "The action code is invalid. Please check and try again.";
          break;
        default:
          errorMessage = error.message || "An unknown error occurred.";
          break;
      }
      return errorMessage.replace(/^Firebase:\s*(Error\s*\(.*\))/i, "$1");
    }
    return "An unknown error occurred.";
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email && !password) {
      toast.error("Both email and password are required!!", { duration: 3000 });
      return;
    }
    if (!email) {
      toast.error("Enter the email address!!", { duration: 3000 });
      return;
    }
    if (!password) {
      toast.error("Enter the password !!", { duration: 3000 });
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      const user = result.user;
      const userUid = user.uid;
      if (rememberMe) {
        Cookies.set("user", userUid, { expires: 7 });
      } else {
        Cookies.set("user", userUid); // Session Cookie
      }
      setIsAuthenticated(true);
      toast.success("Signed in successfully", { duration: 2000 });
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/browse"), 4000);
    } catch (error) {
      console.error("Sign-in error:", error); // Log error details
      toast.error("Please Register your Email !!!", { duration: 4000 });
      setTimeout(() => {
        const emailNotExists = toast(
          <div className="relative flex flex-row">
            <p>Redirecting to sign up page... &nbsp;</p>
            <button onClick={() => toast.dismiss(emailNotExists)}>
              {dismissIcon}
            </button>
          </div>,
          {
            icon: infoIcon,
            duration: 2000,
            dismiss: true,
            position: "bottom-right",
          },
        );
      }, 2000);
      setTimeout(() => {
        navigate("/signup");
      }, 4200);
      setEmail("");
      setPassword("");
    }
  };

  const googleSignIn = async (e) => {
    e.preventDefault();

    const googleLogin = new GoogleAuthProvider();
    googleLogin.setCustomParameters({
      prompt: "consent",
    });

    try {
      const result = await signInWithPopup(firebaseAuth, googleLogin);
      if (result) {
        const user = result.user;
        const googleUid = user.uid;

        // Use getDoc to check if the user exists
        const userDocRef = await getDoc(doc(db, "USERS", googleUid));
        if (userDocRef.exists()) {
          if (googleUid) {
            // Ensure rememberMe is set and then use the updated value
            setRememberMe(() => true);
            // Use a setTimeout to ensure React has finished updating the state
            setTimeout(() => {
              if (rememberMe) {
                console.log("Remember Me : ", rememberMe);
                Cookies.set("user", googleUid, { expires: 7 }); // Persistent cookie
              } else {
                Cookies.set("user", googleUid); // Session cookie
              }
            }, 200);
          }

          setIsAuthenticated(() => true);

          if (isAuthenticated) {
            toast.success("Signed in successfully", {
              duration: 4000,
            });
            setEmail("");
            setPassword("");

            setTimeout(() => {
              navigate("/browse");

              // Unsubscribe from onAuthStateChanged listener after redirect
              const unsubscribe = onAuthStateChanged(firebaseAuth, () => {});
              unsubscribe();
            }, 15000);
          }
        } else {
          await user.reload();
          await user.delete();
          toast.error("Please register your email!!!", {
            duration: 4000,
          });
          setEmail("");
          setPassword("");

          setTimeout(() => {
            const emailNotExists = toast(
              <div className="relative flex flex-row">
                <p>Redirecting to sign up page... &nbsp;</p>
                <button onClick={() => toast.dismiss(emailNotExists)}>
                  {dismissIcon}
                </button>
              </div>,
              {
                icon: infoIcon,
                duration: 1400,
                dismiss: true,
                position: "bottom-right",
              },
            );
          }, 1000);

          setTimeout(() => {
            navigate("/signup");
          }, 4200);
        }
      }
    } catch (error) {
      setEmail("");
      setPassword("");
      toast.error(formatFirebaseError(error), {
        duration: 7000,
      });
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      toast.error("Please Enter the Email Address!!!", {
        duration: 5000,
      });
      return;
    }
    try {
      const q = await query(
        collection(db, "USERS"),
        where("Email", "==", email),
      );
      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        setEmail("");
        setPassword("");
        const passwordResetToast = toast(
          <div className="relative flex flex-row">
            <p>Please reset your password with link in email !!! &nbsp;</p>
            <button onClick={() => toast.dismiss(passwordResetToast)}>
              {dismissIcon}
            </button>
          </div>,
          {
            icon: infoIcon,
            duration: 7000,
            dismiss: true,
          },
        );
        await sendPasswordResetEmail(firebaseAuth, email);
      } else {
        setEmail("");
        setPassword("");
        toast.error("User doesn't exists!!", {
          duration: 3000,
        });
      }
    } catch (error) {
      setEmail("");
      setPassword("");
      toast.error(formatFirebaseError(error), {
        duration: 7000,
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="absolute z-[1] block min-h-[100vh] w-[130vw] overflow-hidden bg-black opacity-55 max-sm:w-screen max-sm:opacity-100"></div>
      <div
        ref={bgImageRef}
        className="absolute h-screen min-h-[100vh] w-[130vw] overflow-hidden bg-cover max-sm:hidden max-sm:h-screen max-sm:w-screen"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      <div className="relative left-0 right-0 top-20 z-auto mx-auto h-[88vh] w-[450px] rounded-[4px] bg-black opacity-[0.66] max-sm:hidden"></div>
      <form className="form-input absolute left-0 right-0 top-20 z-10 mx-auto flex h-auto w-[450px] flex-col overflow-hidden px-[68px] py-[48px] opacity-100">
        <h1 className="relative h-[71px] text-left text-[32px] font-bold leading-normal text-white max-sm:ml-2">
          Sign In
        </h1>
        <FloatingLabelInput
          label="Email Address"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-input autocomplete peer -my-2 flex h-[56px] w-[314px] flex-row items-center justify-center rounded-sm border border-gray-500 bg-[#111010] bg-opacity-[0.75] px-2.5 text-[16px] text-white outline-none focus:outline-white focus:ring-0`}
        />
        <FloatingLabelInput
          label="Password"
          type={passwordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`form-input autocomplete peer -my-2 flex h-[56px] w-[314px] flex-row items-center justify-center rounded-sm border border-gray-500 bg-[#111010] bg-opacity-[0.75] px-2.5 text-[16px] text-white outline-none focus:outline-white focus:ring-0`}
        />
        <div className="pointer-events-none relative bottom-11 flex h-fit items-center justify-end pr-3 max-sm:pr-6">
          <button
            className="pointer-events-auto relative z-10 h-[16px] w-[16px] px-3 max-sm:px-5"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="white"
                    d="m10.12 10.827l4.026 4.027a.5.5 0 0 0 .708-.708l-13-13a.5.5 0 1 0-.708.708l3.23 3.23A6 6 0 0 0 3.2 6.182a6.7 6.7 0 0 0-1.117 1.982c-.021.061-.047.145-.047.145l-.018.062s-.076.497.355.611a.5.5 0 0 0 .611-.355l.001-.003l.008-.025l.035-.109a5.7 5.7 0 0 1 .945-1.674a5 5 0 0 1 1.124-1.014L6.675 7.38a2.5 2.5 0 1 0 3.446 3.446m-3.8-6.628l.854.854Q7.564 5 8 5c2.044 0 3.286.912 4.028 1.817a5.7 5.7 0 0 1 .945 1.674q.025.073.035.109l.008.025v.003l.001.001a.5.5 0 0 0 .966-.257v-.003l-.001-.004l-.004-.013a2 2 0 0 0-.06-.187a6.7 6.7 0 0 0-1.117-1.982C11.905 5.089 10.396 4 8.002 4c-.618 0-1.177.072-1.681.199"
                  ></path>
                </svg>
              </span>
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="white"
                    d="M2.984 8.625v.003a.5.5 0 0 1-.612.355c-.431-.114-.355-.611-.355-.611l.018-.062s.026-.084.047-.145a6.7 6.7 0 0 1 1.117-1.982C4.096 5.089 5.605 4 8 4s3.904 1.089 4.802 2.183a6.7 6.7 0 0 1 1.117 1.982a4 4 0 0 1 .06.187l.003.013v.004l.001.002a.5.5 0 0 1-.966.258l-.001-.004l-.008-.025l-.035-.109a5.7 5.7 0 0 0-.945-1.674C11.286 5.912 10.045 5 8 5s-3.285.912-4.028 1.817a5.7 5.7 0 0 0-.945 1.674l-.035.109zM5.5 9.5a2.5 2.5 0 1 1 5 0a2.5 2.5 0 0 1-5 0"
                  ></path>
                </svg>
              </span>
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={handleSignIn}
          className="relative my-2 flex h-[38px] w-full cursor-pointer flex-row items-center justify-center rounded-sm bg-[#e50914] font-semibold text-white outline-none max-sm:my-2 max-sm:w-[98%] max-sm:pr-3"
          ref={(el) => (labelRefs.current[0] = el)}
        >
          Sign In
        </button>
        <div className="relative my-1 flex h-[21px] w-full flex-row items-center justify-center text-[#b7b6b5]">
          <label>OR</label>
        </div>
        <button
          className="relative my-2 flex h-10 w-full cursor-pointer flex-row items-center justify-center bg-[#a7a79e] bg-opacity-30 px-4 py-[6px] text-[16px] font-semibold text-white max-sm:my-0 max-sm:w-[98%] max-sm:pr-3"
          type="button"
          ref={(el) => (labelRefs.current[1] = el)}
          onClick={googleSignIn}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="18pt"
            height="18pt"
            viewBox="0 0 48 48"
            className="z-10 w-full"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
        </button>
        <div className="relative -top-2 my-2 flex flex-wrap items-center justify-center text-wrap p-2 text-[#ffffd6] hover:text-blue-200 hover:underline">
          <Link to="" onClick={handlePasswordReset}>
            Forgot password?
          </Link>
        </div>
        <div className="relative -top-4 sm:my-2">
          <Checkbox size="md" variant="plain" onChange={handleRememberMe} />
          <label className="relative -top-1 ml-3 font-normal text-white">
            Remember me
          </label>
        </div>
        <div className="relative -top-8 my-4 flex flex-row">
          <p className="text-left text-[#b6b4b4]">New to MovieFlix?</p>
          <Link
            className="ml-4 font-semibold text-[#ffffef] hover:text-blue-200 hover:underline"
            to="/signup" // Use Link to navigate to the sign-up page
          >
            Sign up now.
          </Link>
        </div>
      </form>
      {/* <footer
        className="absolute left-0 right-0 w-[130vw] bg-black font-normal text-white max-sm:w-fit"
        style={{ top: footerStyles.top, height: footerStyles.height }}
      ></footer> */}
    </div>
  );
};

export default Login;
