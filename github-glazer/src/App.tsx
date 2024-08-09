import React, { useState } from "react";
import axios from "axios";
import OpenAI from "openai";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState("");
  const [responseReceived, setResponseReceived] = useState(false);
  const [responseSet, setResponseSet] = useState(false);

  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleButtonClick = async () => {
    if (responseSet) {
      setUsername("");
      setResponse("");
      setResponseReceived(false);
      setResponseSet(false);
    } else {
      const githubApiKey = import.meta.env.VITE_GITHUB_API_KEY;

      try {
        const headers = {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${githubApiKey}`,
        };

        let response = await fetch(`https://api.github.com/users/${username}`, {
          headers,
        });

        if (response.status === 404) {
          setResponse("User not found. Please try again");
        } else if (response.ok) {
          let profileResponse = await response.json();
          response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated`,
            { headers }
          );
          const repoResponse = await response.json();

          let readmeResponse = "";
          try {
            let readmeData = await axios.get(
              `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
              { headers }
            );
            readmeResponse = readmeData.data;
          } catch (error) {
            console.error("Error fetching user's README.md:", error);
          }

          const datas = {
            name: profileResponse.name,
            bio: profileResponse.bio,
            company: profileResponse.company,
            location: profileResponse.location,
            followers: profileResponse.followers,
            following: profileResponse.following,
            public_repos: profileResponse.public_repos,
            profile_readme: readmeResponse,
            last_15_repositories: repoResponse
              .map((repo: any) => ({
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                open_issues_count: repo.open_issues_count,
                license: repo.license,
                fork: repo.fork,
              }))
              .slice(0, 15),
          };

          let prompt = `Give a short and wholesome / encouraging compliment session for the following GitHub profile: ${username}. Here are the details: "${JSON.stringify(
            datas
          )}"`;

          try {
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0125",
              messages: [
                {
                  role: "system",
                  content:
                    "You compliment and glaze people's GitHub accounts based on their bio, name, README, and repos as wholesomely and nicely as possible, and keep it around 250-300 words and break it into multiple paragraphs, full of internet humour and encouraging about most aspects of their GitHub.",
                },
                { role: "user", content: prompt },
              ],
            });

			const glaze = completion.choices[0].message.content;
            setResponse(glaze || "Our glazers are recharging, try again later :(");
            setResponseSet(true);
          } catch (error) {
            console.error("Error generating compliment:", error);
            setResponse("There was an error generating the compliment. Please try again later.");
          }
        } else {
          setResponse("Our glazers are busy elsewhere, try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        setResponse("Our glazers are busy elsewhere, try again later.");
      }

      setResponseReceived(true);
    }
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
        {responseSet ? "Clear" : "Glaze"}
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
