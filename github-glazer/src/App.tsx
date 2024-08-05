import React, { useState } from "react";

const App: React.FC = () => {
	const [username, setUsername] = useState("");
	const [response, setResponse] = useState("");

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleButtonClick = () => {
		console.log("GitHub Username:", username);
		// Example response based on the username
		setResponse(`You entered: ${username}`);
	};

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<h1 className="text-4xl font-bold m-4">GitHub Glazers</h1>
			<p className="text-lg mb-4">Enter a GitHub username to start glazing</p>
			<input
				type="text"
				placeholder="Enter GitHub username"
				value={username}
				onChange={handleInputChange}
				className="input bg-primary input-bordered w-full max-w-xs mb-4"
			/>
			<button
				onClick={handleButtonClick}
				className="btn bg-primary p-2 rounded-md w-full max-w-xs mb-4"
			>
				Glaze
			</button>
			<div className="my-auto w-full max-w-s">
				{response ? (
					<div className="text-lg font-bold p-4 rounded-md w-full max-w-xs text-white bg-primary">
						{response}
					</div>
				) : (
					<div className="text-lg font-bold p-4 rounded-md w-full max-w-xs text-white bg-primary">
						Enter a username to start glazing
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
