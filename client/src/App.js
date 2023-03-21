import "./App.css";
import {
	BrowserRouter,
	matchPath,
	Route,
	Routes,
	HashRouter,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import Dashboard from "./components/Dashboard";
import ControlPanel from "./components/ControlPanel";
import { instance, SERVER } from "./components/axios";
import CreateAccountPage from "./components/CreateAccountPage";

function App() {
	const cookie = new Cookies();
	useEffect(() => {
		const header = {};
		instance.get("/api");
	}, [instance]);
	return (
		<div className="bc">
			<HashRouter>
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
							<Dashboard
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
						path="/controlpanel"
						element={
							<ControlPanel
								links={["/dashboard", "/controlpanel"]}
								text={["Control Panel", "Dashboard"]}
								axios_instance={instance}
								server={SERVER}
							/>
						}
					/>
				</Routes>
			</HashRouter>
		</div>
	);
}

export default App;
