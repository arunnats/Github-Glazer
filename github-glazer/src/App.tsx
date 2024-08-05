import React, { useState } from "react";

const App: React.FC = () => {
	const [username, setUsername] = useState("");
	const [response, setResponse] = useState("");
	const [responseReceived, setResponseReceived] = useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleButtonClick = async () => {
		const githubApiKey = import.meta.env.VITE_GITHUB_API_KEY;
		console.log("GitHub Username:", username);

		try {
			const response = await fetch(`https://api.github.com/users/${username}`, {
				headers: {
					Accept: "application/vnd.github.v3+json",
					Authorization: `token ${githubApiKey}`,
				},
			});

			if (response.status === 404) {
				console.log("404 aaa");
				setResponse("User not found. Please try again");
			} else if (response.ok) {
				const profileResponse = await response.json();
				console.log(profileResponse);
				setResponse(`You entered: ${username}`);
			} else {
				setResponse("Our glazers are busy elsewhere, try again later.");
			}
		} catch (error) {
			console.error("Error:", error);
			setResponse("Our glazers are busy elsewhere, try again later.");
		}

		setResponseReceived(true);
	};

	return (
		<div className="flex flex-col items-center min-h-screen p-8">
			<h1 className="text-5xl font-bold mb-6 text-center">GitHub Glazers</h1>
			<p className="text-2xl mb-6">Enter a GitHub username to start glazing</p>
			<input
				type="text"
				placeholder="Enter GitHub username"
				value={username}
				onChange={handleInputChange}
				className="input input-bordered bg-primary w-full max-w-md text-xl p-4 mb-6"
			/>
			<button
				onClick={handleButtonClick}
				className="btn bg-primary w-full max-w-md mb-6 text-xl"
			>
				Glaze
			</button>
			<div className="flex flex-col w-full max-w-lg min-h-[200px] bg-primary text-white p-6 rounded-md">
				{responseReceived ? (
					<div className="text-xl font-bold">{response}</div>
				) : (
					<div className="text-xl font-bold">
						Enter a username to start glazing
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
