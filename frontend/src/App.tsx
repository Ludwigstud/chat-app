import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatLobby from "./components/ChatLobby";
import ChatRoom from "./components/ChatRoom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Login />}
				/>
				<Route
					path="/register"
					element={<Register />}
				/>

				<Route
					path="/lobby"
					element={<ChatLobby />}
				/>
				<Route
					path="/chat/:roomId"
					element={<ChatRoom />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
