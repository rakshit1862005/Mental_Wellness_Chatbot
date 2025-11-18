'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";

export default function SignUpPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        emergencyContact: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => {
        setErrorMsg("");
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        const { name, email, password, confirmPassword, emergencyContact } = formData;

        // ------------------------------
        // VALIDATIONS
        // ------------------------------
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (!agreedToTerms) {
            setErrorMsg("Please agree to the Terms & Conditions.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name:name,
                    email:email,
                    password:password,
                    emergencyContact:emergencyContact
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setLoading(false);
                setErrorMsg(data.message || "Signup failed.");
                return;
            }

            // ------------------------------
            // SUCCESSFUL SIGNUP
            // ------------------------------
            setSuccessMsg("Account created successfully!");

            // Store email for later login/session usage
            localStorage.setItem("username", email);

            // Redirect after a second
            setTimeout(() => {
                router.push("/pages/login");
            }, 1200);

        } catch (err) {
            console.error("Signup error:", err);
            setErrorMsg("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>

                {/* Header */}
                <div className={styles.authHeader}>
                    <div className={styles.logo}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                    </div>
                    <h1>Create Account</h1>
                    <p>Start your mental wellness journey today</p>
                </div>

                {/* ERROR MESSAGE */}
                {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}

                {/* SUCCESS MESSAGE */}
                {successMsg && <div className={styles.successBox}>{successMsg}</div>}

                {/* FORM */}
                <form onSubmit={handleSubmit} className={styles.authForm}>

                    {/* Name */}
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className={styles.formGroup}>
                        <label>Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className={styles.formGroup}>
                        <label>Emergency Contact (Optional)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="tel"
                                name="emergencyContact"
                                placeholder="Trusted contact number"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className={styles.termsCheckbox}>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                            />
                            <span>
                                I agree to the{" "}
                                <Link href="/terms" className={styles.link}>
                                    Terms & Conditions
                                </Link>
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className={styles.submitBtn} 
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* Login Link */}
                <div className={styles.authFooter}>
                    <p>
                        Already have an account?{" "}
                        <Link href="/login" className={styles.link}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Side Panel */}
            <div className={styles.sidePanel}>
                <div className={styles.sidePanelContent}>
                    <h2>MindWell</h2>
                    <p className={styles.tagline}>Your Mental Wellness Companion</p>
                </div>
            </div>
        </div>
    );
}
