import { useState } from "react";
import "./Login.css";

export default function Login() {
    const [isSignup, setIsSignup] = useState(false);
    const [role, setRole] = useState("Student");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(
            `${isSignup ? "Signup" : "Login"} UI ready! Backend abhi connect nahi hai.`
        );
    };

    return (
        <main className="auth-page">
            <nav className="auth-nav">
                <a href="/" className="auth-brand">
                    <span className="brand-icon">C</span>
                    CampusClub
                </a>
                <a href="/" className="back-home">← Back to Home</a>
            </nav>

            <section className="auth-container">
                <div className="auth-info">
                    <span className="auth-tag">YOUR CAMPUS. YOUR COMMUNITY.</span>
                    <h1>
                        Find your people.
                        <br />
                        Build your world.
                    </h1>
                    <p>
                        Discover clubs, meet like-minded students, and create
                        unforgettable campus memories.
                    </p>

                    <div className="auth-stats">
                        <div><strong>25+</strong><span>Student Clubs</span></div>
                        <div><strong>2.4K+</strong><span>Active Members</span></div>
                        <div><strong>50+</strong><span>Annual Events</span></div>
                    </div>
                </div>

                <div className="auth-card">
                    <div className="auth-card-icon">✦</div>

                    <h2>{isSignup ? "Create your account" : "Welcome back."}</h2>
                    <p className="auth-subtitle">
                        {isSignup
                            ? "Join your campus community today."
                            : "Your next chapter starts here."}
                    </p>

                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={!isSignup ? "active" : ""}
                            onClick={() => setIsSignup(false)}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className={isSignup ? "active" : ""}
                            onClick={() => setIsSignup(true)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <label>
                                Full Name
                                <input type="text" placeholder="Enter your name" required />
                            </label>
                        )}

                        <label>
                            Email Address
                            <input
                                type="email"
                                placeholder="you@university.edu"
                                required
                            />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                placeholder="Enter your password"
                                minLength={6}
                                required
                            />
                        </label>

                        {isSignup && (
                            <label>
                                Join as
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option>Student</option>
                                    <option>Club Owner</option>
                                </select>
                            </label>
                        )}

                        {!isSignup && (
                            <div className="auth-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    Remember me
                                </label>
                                <span className="forgot-text">Forgot password?</span>
                            </div>
                        )}

                        <button className="auth-submit" type="submit">
                            {isSignup ? "Create Account →" : "Login to CampusClub →"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        {isSignup ? "Already a member?" : "New to CampusClub?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsSignup(!isSignup)}
                        >
                            {isSignup ? "Login" : "Create account"}
                        </button>
                    </p>

                    <div className="auth-footer">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </div>
                </div>
            </section>
        </main>
    );
}