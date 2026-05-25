import { useState } from "react";

import AccountSidebar from "../AccountSidebar";

import "./index.css";

const MyAccount = () => {
    const [showPasswordBox, setShowPasswordBox] =
        useState(false);

    return (
        <section className="myAccount">
            <div className="container">
                <div className="myAccount__wrapper">
                    {/* SIDEBAR */}

                    <AccountSidebar />

                    {/* CONTENT */}

                    <div className="myAccount__content">
                        {/* PROFILE */}

                        <div className="myAccount__card">
                            {/* HEADER */}

                            <div className="myAccount__header">
                                <h2>My Profile</h2>

                                <button
                                    onClick={() =>
                                        setShowPasswordBox(
                                            !showPasswordBox
                                        )
                                    }
                                >
                                    CHANGE PASSWORD
                                </button>
                            </div>

                            {/* FORM */}

                            <form className="myAccount__form">
                                <div className="myAccount__formGroup">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email"
                                    />
                                </div>

                                <div className="myAccount__formGroup">
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                    />
                                </div>

                                <button type="submit">
                                    UPDATE PROFILE
                                </button>
                            </form>
                        </div>

                        {/* PASSWORD */}

                        {showPasswordBox && (
                            <div className="myAccount__card">
                                {/* HEADER */}

                                <div className="myAccount__header">
                                    <h2>
                                        Change Password
                                    </h2>
                                </div>

                                {/* FORM */}

                                <form className="myAccount__form">
                                    <div className="myAccount__formGroup">
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                        />

                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                        />
                                    </div>

                                    <button type="submit">
                                        CHANGE PASSWORD
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyAccount;