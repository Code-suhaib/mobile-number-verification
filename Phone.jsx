import React, { useState, useEffect, useRef } from "react";
import { auth } from "./firebase.config";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "./Phone.css";

function Phone() {
    const [phone, setPhone] = useState("");
    const [confirmation, setConfirmation] = useState(null);
    const [otp, setOtp] = useState("");
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
    const recaptchaContainerRef = useRef(null);

    useEffect(() => {
        if (recaptchaContainerRef.current && !window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                    size: "normal",
                    callback: (response) => {
                        console.log("reCAPTCHA solved!", response);
                        setRecaptchaLoaded(true);
                    },
                    "expired-callback": () => {
                        console.log("reCAPTCHA expired. Resetting...");
                        window.recaptchaVerifier.reset();
                        setRecaptchaLoaded(false);
                    }
                });
                window.recaptchaVerifier.render().then((widgetId) => {
                    window.recaptchaWidgetId = widgetId;
                });
            } catch (error) {
                console.error("Failed to initialize reCAPTCHA:", error);
            }
        }
    }, []);

    const sendOtp = async () => {
        if (!recaptchaLoaded) {
            alert("reCAPTCHA not loaded yet. Please wait.");
            return;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
            setConfirmation(confirmationResult);
            alert("OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert(`Failed to send OTP: ${error.message}`);
        }
    };

    const verifyOtp = async () => {
        try {
            if (!confirmation) {
                alert("Please request an OTP first.");
                return;
            }
            await confirmation.confirm(otp);
            alert("Phone number verified successfully!");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="phone-signin">
            <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
            <div className="phone-content">
                <PhoneInput
                    country={"in"}
                    value={phone}
                    onChange={(phone) => setPhone("+" + phone)}
                    placeholder="Enter phone number"
                />
                <button onClick={sendOtp} className="btn_otp">Send OTP</button>
                <br />
            </div>
            <input
                onChange={(e) => setOtp(e.target.value)}
                className="txt"
                type="text"
                placeholder="Enter OTP"
                value={otp}
            />
            <br />
            <button onClick={verifyOtp} className="btn-verify">Verify OTP</button>
        </div>
    );
}

export default Phone;