import "./App.css";
import React, { lazy, Suspense, useEffect } from "react";
import NavBar from "./components/NavBar.jsx";
import {
	Route,
	Routes,
	HashRouter,
} from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import { instance, SERVER } from "./components/axios";
import LoadingPage from "./components/LoadingPage.jsx";

const LazyDashboard = lazy(() => import("./components/Dashboard.jsx"));
const LazyControlPanel = lazy(() => import("./components/ControlPanel.jsx"));
const LazyCreateAccountPage = lazy(() =>
	import("./components/CreateAccountPage.jsx")
);
const LazyThankYouPage = lazy(() => import("./components/ThanksYouPage.jsx"));

function App() {
	useEffect(() => {
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
								<LazyCreateAccountPage
									axios_instance={instance}
									server={SERVER}
									endpoint="/api/register/new/user"
									title="Create an account"
									buttonText="Create Account"
								/>
							}
						/>

						{/* <Route exact path="/loading" element={<LoadingPage />} /> */}

						<Route
							exact
							path="/join"
							element={
								<LazyCreateAccountPage
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
								<LazyCreateAccountPage
									axios_instance={instance}
									server={SERVER}
									endpoint="/api/join/organization"
									title="Join an organization"
									buttonText="Join"
								/>
							}
						/>

						<Route exact path="/thankyou" element={<LazyThankYouPage />} />
					</Routes>
				</Suspense>
			</HashRouter>
		</div>
	);
}

export default App;
