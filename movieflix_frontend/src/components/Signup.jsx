import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import bg from "../assets/images/bg.jpg";
import FloatingLabelInput from "../utils/FloatingLabelInput.jsx";
import { firebaseAuth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoCloseCircleSharp } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const labelRefs = useRef([]);
  const infoIcon = <BsFillInfoCircleFill style={{ fontSize: "30px" }} />;
  const dismissIcon = <IoCloseCircleSharp style={{ fontSize: "25px" }} />;
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // Prevent the default behavior of form submission
    setPasswordVisible((passwordVisible) => !passwordVisible);
  };

  useEffect(() => {
    labelRefs.current.forEach((label) => {
      if (label) {
        const handleLabelHover = () => {
          label.style.cursor = "pointer";
        };
        label.addEventListener("mouseover", handleLabelHover);
        return () => {
          label.removeEventListener("mouseover", handleLabelHover);
        };
      }
    });
  }, []);

  const formatFirebaseError = (error) => {
    if (error && error.message) {
      return error.message.replace(/^Firebase:\s*(Error\s*\(.*\))/i, "$1"); //regular exp to check the firebase message
    }
    return "An unknown error occurred";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create a new user with email and password
      const result = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      const user = result.user;
      const uid = user.uid;

      // Send email verification to the user
      await sendEmailVerification(user);
      const emailVerifyToast = toast(
        <div className="relative flex flex-row">
          <p>
            Please verify your email address through the link sent in the mail
            (60secs)! &nbsp;
          </p>
          <button onClick={() => toast.dismiss(emailVerifyToast)}>
            {dismissIcon}
          </button>
        </div>,
        {
          icon: infoIcon,
          duration: 7000,
          dismiss: true,
        },
      );
      setEmail("");
      setPassword("");
      const checkInterval = 5000;
      const verificationWindow = 60000; //time to verify the email
      let timeElapsed = 0;

      const checkEmailVerified = async () => {
        await user.reload();

        if (user.emailVerified) {
          toast.success("Account Created Successfully!!", {
            duration: 6000,
          });
          try {
            await setDoc(doc(db, "USERS", uid), {
              Email: email,
              UID: uid,
            });
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          return;
        }

        timeElapsed += checkInterval;

        if (timeElapsed < verificationWindow) {
          setTimeout(checkEmailVerified, checkInterval);
        } else {
          await user.reload();
          if (!user.emailVerified) {
            await user.delete();
            toast.error("User account deleted, Email not Verified");
            setEmail("");
            setPassword("");
          }
        }
      };

      checkEmailVerified();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setEmail("");
        setPassword("");
        toast.error("Email already registered !!!", { duration: 2000, });
        setTimeout(() => {
          const emailExists = toast(
            <div className="relative flex flex-row">
              <p>Redirecting to login page... &nbsp;</p>
              <button onClick={() => toast.dismiss(emailExists)}>
                {dismissIcon}
              </button>
            </div>,
            {
              icon: infoIcon,
              duration: 2000,
              dismiss: true,
              position:'bottom-right',
            },
          );
        },2000)
        setTimeout(() => {
              navigate("/login");
            }, 5000);
        return;
      }
      else {
        toast.error(formatFirebaseError(error));
      }
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden overflow-y-hidden">
      <Header />
      <div className="absolute z-[1] block min-h-[100vh] w-[130vw] overflow-hidden bg-black bg-opacity-0 max-sm:w-screen max-sm:bg-opacity-100"></div>
      <div
        className="max-sm:min-w-screen absolute inset-0 z-0 h-[130vh] w-[130vw] bg-cover brightness-50 max-sm:hidden"
        style={{
          backgroundImage: `url(${bg})`,
          transform: "translateX(-20vw) translateY(-30vh)",
        }}
      ></div>
      <div className="absolute left-0 right-0 top-[10%] z-10 mx-auto flex min-h-fit w-screen flex-col items-center text-white max-sm:top-[25%]">
        {/* <div className="relative mb-10 w-fit">
          <h1 className="text-center font-[900] sm:text-wrap sm:px-5 sm:text-[38px] lg:text-[48px] max-sm:text-wrap max-sm:px-2 max-sm:text-center max-sm:text-[36px] max-md:text-wrap max-md:px-5 max-md:text-[42px]">
            Unlimited movies, TV shows and more
          </h1> */}
        {/* <p className="my-6 text-center font-normal sm:my-3 sm:px-5 sm:text-[20px] lg:text-[24px] max-sm:my-3 max-sm:px-5 max-sm:text-[20px] max-md:my-3 max-md:px-5 max-md:text-[20px]">
            Watch anywhere. Cancel anytime.
          </p> */}
        <div className="absolute left-0 right-0 top-0 z-auto mx-auto h-[88vh] max-h-[88vh] w-[450px] rounded-[4px] bg-black bg-opacity-[0.66] max-sm:hidden"></div>
        <form
          className="form-input relative left-0 right-0 top-0 z-50 mx-auto flex h-[88vh] w-[450px] select-none flex-col overflow-hidden px-[68px] py-[48px] opacity-100 max-sm:-top-[5rem]"
          onSubmit={handleSignUp}
        >
          <h1 className="relative top-0 h-[71px] select-none text-left text-[32px] font-bold leading-normal text-white max-sm:ml-2">
            Sign Up
          </h1>
          <FloatingLabelInput
            label="Email Address"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-input autocomplete peer -my-2 flex h-[56px] w-[314px] select-none flex-row items-center justify-center rounded-sm border border-gray-500 bg-[#111010] bg-opacity-[0.75] px-2.5 text-[16px] text-white outline-none focus:outline-white focus:ring-0`}
          />
          <FloatingLabelInput
            label="Password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-input autocomplete peer -my-2 flex h-[56px] w-[314px] select-none flex-row items-center justify-center rounded-sm border border-gray-500 bg-[#111010] bg-opacity-[0.75] px-2.5 text-[16px] text-white outline-none focus:outline-white focus:ring-0`}
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
            type="submit"
            className="relative my-2 flex h-[40px] w-full cursor-pointer select-none flex-row items-center justify-center rounded-sm bg-[#e50914] font-semibold text-white outline-none max-sm:my-2 max-sm:w-[98%] max-sm:pr-3"
            ref={(el) => (labelRefs.current[0] = el)}
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              role="img"
              data-icon="ChevronRightStandard"
              aria-hidden="true"
              className="relative mr-2 w-fit"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.5859 12L8.29303 19.2928L9.70725 20.7071L17.7072 12.7071C17.8948 12.5195 18.0001 12.2652 18.0001 12C18.0001 11.7347 17.8948 11.4804 17.7072 11.2928L9.70724 3.29285L8.29303 4.70706L15.5859 12Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
          <div className="relative mt-10 flex h-[21px] w-full select-none flex-row items-center justify-center text-[#b7b6b5]">
            <label>OR</label>
          </div>
          <div className="relative my-6 flex select-none flex-row">
            <p className="text-left text-[#b6b4b4]">Already have an account?</p>
            <Link
              className="ml-4 font-semibold text-[#ffffef] hover:text-blue-200 hover:underline"
              to="/login" // Use Link to navigate to the sign-up page
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Signup;
