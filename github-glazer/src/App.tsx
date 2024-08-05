import React, { useState } from "react";

const App: React.FC = () => {
	const [username, setUsername] = useState("");

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleButtonClick = () => {
		console.log("GitHub Username:", username);
	};

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<h1 className="text-4xl font-bold mb-4">GitHub Glazers</h1>
			<p className="text-lg mb-4">Enter a GitHub username to start glazing</p>
			<input
				type="text"
				placeholder="Enter GitHub username"
				value={username}
				onChange={handleInputChange}
				className="border border-gray-300 p-2 rounded-md mb-4 w-full max-w-xs"
			/>
			<button
				onClick={handleButtonClick}
				className="btn btn-accent p-2 rounded-md"
			>
				Glaze
			</button>
		</div>
	);
};

export default App;
