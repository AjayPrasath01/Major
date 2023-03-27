import "./App.css";
import React, { lazy, Suspense } from "react";
import NavBar from "./components/NavBar.jsx";
import {
	BrowserRouter,
	matchPath,
	Route,
	Routes,
	HashRouter,
} from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { instance, SERVER } from "./components/axios";
import CreateAccountPage from "./components/CreateAccountPage.jsx";
import ThanksYouPage from "./components/ThanksYouPage.jsx";
import LoadingPage from "./components/LoadingPage.jsx";

const LazyDashboard = lazy(() => import("./components/Dashboard.jsx"));
const LazyControlPanel = lazy(() => import("./components/ControlPanel.jsx"));

function App() {
	const cookie = new Cookies();
	useEffect(() => {
		const header = {};
		instance.get("/api");
	}, [instance]);
	return (
		<div className="bc">
			<HashRouter>
				<NavBar axios_instance={instance} />
				<Suspense fallback={<LoadingPage />}>
					<Routes>
						<Route
							exact
							path="/"
							element={
								<LoginPage
									xsrf={cookie.get("XSRF-TOKEN")}
									axios_instance={instance}
									server={SERVER}
								/>
							}
						/>
						<Route
							exact
							path="/dashboard"
							element={
								<LazyDashboard
									links={["/dashboard", "/controlpanel"]}
									text={["Control Panel", "Dashboard"]}
									axios_instance={instance}
									server={SERVER}
									xsrf={cookie.get("XSRF-TOKEN")}
								/>
							}
						/>
						<Route
							exact
							path="/controlpanel"
							element={
								<LazyControlPanel
									axios_instance={instance}
									server={SERVER}
									endpoint="/api/register/new/user"
									title="Create an account"
									buttonText="Create Account"
								/>
							}
						/>

						<Route
							exact
							path="/createAccount"
							element={
								<CreateAccountPage
									axios_instance={instance}
									server={SERVER}
									endpoint="/api/register/new/user"
									title="Create an account"
									buttonText="Create Account"
								/>
							}
						/>

						<Route exact path="/loading" element={<LoadingPage />} />

						<Route
							exact
							path="/join"
							element={
								<CreateAccountPage
									axios_instance={instance}
									server={SERVER}
									endpoint="/api/join/organization"
									title="Join an organization"
									buttonText="Join"
								/>
							}
						/>

						<Route
							exact
							path="/join"
							element={
								<CreateAccountPage
									axios_instance={instance}
									server={SERVER}
									endpoint="/api/join/organization"
									title="Join an organization"
									buttonText="Join"
								/>
							}
						/>

						<Route exact path="/thankyou" element={<ThanksYouPage />} />
					</Routes>
				</Suspense>
			</HashRouter>
		</div>
	);
}

export default App;
