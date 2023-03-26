import React from "react";
import "./ThankYou.css";
import { NavLink } from "react-router-dom";
function ThanksYouPage() {
	return (
		<div className="loginPage">
			<span className="right_top design"></span>
			<span className="right_bottom design"></span>
			<span className="center1 design"></span>
			<span className="center2 design"></span>
			<span className="center3 design"></span>
			<h1 className="thank-you">Thank you</h1>
			<NavLink to="/" className="thank-you-link">
				Login
			</NavLink>
		</div>
	);
}

export default ThanksYouPage;
