import { useState } from "react";
import React from "react";

function PasswordInputField(props) {
	const { password, keyPressed, setPassword } = props;
	const [showPassword, setShowPassword] = useState(false);
	return (
		<span className="password-holder">
			<input
				className="input-field-login create-account-input"
				value={password}
				placeholder="Password"
				onKeyDown={keyPressed}
				type={showPassword ? "text" : "password"}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button
				className="password-eye"
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? (
					<svg
						height="18"
						width="18"
						viewBox="0 0 19 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9.33997 1.39636C2.54726 1.39636 0 8.18906 0 8.18906C0 8.18906 2.54726 14.9818 9.33997 14.9818C16.1327 14.9818 18.6799 8.18906 18.6799 8.18906C18.6799 8.18906 16.1327 1.39636 9.33997 1.39636ZM9.33997 3.94363C11.6843 3.94363 13.5854 5.84473 13.5854 8.18906C13.5854 10.5334 11.6843 12.4345 9.33997 12.4345C6.99563 12.4345 5.09453 10.5334 5.09453 8.18906C5.09453 5.84473 6.99563 3.94363 9.33997 3.94363ZM9.33997 5.6418C8.66439 5.6418 8.01648 5.91017 7.53878 6.38788C7.06107 6.86558 6.7927 7.51349 6.7927 8.18906C6.7927 8.86464 7.06107 9.51255 7.53878 9.99025C8.01648 10.468 8.66439 10.7363 9.33997 10.7363C10.0155 10.7363 10.6634 10.468 11.1412 9.99025C11.6189 9.51255 11.8872 8.86464 11.8872 8.18906C11.8872 7.51349 11.6189 6.86558 11.1412 6.38788C10.6634 5.91017 10.0155 5.6418 9.33997 5.6418Z"
							fill="#63686F"
						></path>
						<rect
							x="15.2368"
							width="1.79338"
							height="20.8952"
							rx="0.89669"
							transform="rotate(42.9479 15.2368 0)"
							fill="#63686F"
						></rect>
					</svg>
				) : (
					<svg
						height="18"
						width="18"
						viewBox="0 0 20 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10.2389 0.578735C3.44619 0.578735 0.898926 7.37144 0.898926 7.37144C0.898926 7.37144 3.44619 14.1641 10.2389 14.1641C17.0316 14.1641 19.5789 7.37144 19.5789 7.37144C19.5789 7.37144 17.0316 0.578735 10.2389 0.578735ZM10.2389 3.126C12.5832 3.126 14.4843 5.02711 14.4843 7.37144C14.4843 9.71577 12.5832 11.6169 10.2389 11.6169C7.89456 11.6169 5.99345 9.71577 5.99345 7.37144C5.99345 5.02711 7.89456 3.126 10.2389 3.126ZM10.2389 4.82417C9.56332 4.82417 8.91541 5.09255 8.4377 5.57025C7.96 6.04795 7.69163 6.69586 7.69163 7.37144C7.69163 8.04701 7.96 8.69492 8.4377 9.17262C8.91541 9.65033 9.56332 9.9187 10.2389 9.9187C10.9145 9.9187 11.5624 9.65033 12.0401 9.17262C12.5178 8.69492 12.7862 8.04701 12.7862 7.37144C12.7862 6.69586 12.5178 6.04795 12.0401 5.57025C11.5624 5.09255 10.9145 4.82417 10.2389 4.82417Z"
							fill="#63686F"
						></path>
					</svg>
				)}
			</button>
		</span>
	);
}

export default PasswordInputField;
