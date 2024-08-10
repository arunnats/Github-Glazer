import React, { useState } from "react";
import axios from "axios";
const OpenAI = (await import("openai")).default;

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState("");
  const [responseReceived, setResponseReceived] = useState(false);
  const [responseSet, setResponseSet] = useState(false);
  const [glazing, setGlazing] = useState(false);

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
    } else if (username === "") {
      alert("Github username can't be empty");
    } else {
      setGlazing(true);

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
          setResponseSet(true);
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
              `https://raw.githubusercontent.com/${username}/${username}/main/README.md?raw=true`
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

          let prompt = `Give a short and wholesome compliment session with a little witty sarcasm for the following GitHub profile: ${username}. Here are the details: "${JSON.stringify(
            datas
          )}"`;

          try {
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0125",
              messages: [
                {
                  role: "system",
                  content:
                    "You glaze people's GitHub accounts based on their bio, name, README, and repos as wholesomely and nicely as possible with a twinge of sarcasm, and keep it around 250-300 words and break it into multiple paragraphs, full of internet humour and encouraging about most aspects of their GitHub.",
                },
                { role: "user", content: prompt },
              ],
            });

            const glaze = completion.choices[0].message.content;
            setResponse(
              glaze || "Our glazers are recharging, try again later :("
            );
            setResponseSet(true);
          } catch (error) {
            console.error("Error generating compliment:", error);
            setResponseSet(true);
            setResponse(
              "There was an error generating the compliment. Please try again later."
            );
          }

          setGlazing(false);
        } else {
          setResponseSet(true);
          setResponse("Our glazers are busy elsewhere, try again later.");
          setGlazing(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setResponseSet(true);
        setResponse("Our glazers are busy elsewhere, try again later.");
        setGlazing(false);
      }

      setResponseReceived(true);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <a href="https://github.com/arunnats/Github-Glazer">
        <h1 className="text-6xl font-bold mb-6 text-center hover:text-blue-200">
          GitHub Glazer
        </h1>
      </a>
      {/* <p className="text-2xl mb-6 w-full max-w-xl">
        Feeling down? Job market seems rough? Projects not getting enough
        traction? You look like you could use a little glazing.
      </p> */}
      <p className="text-3xl mb-6">Enter a GitHub username to start glazing</p>
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
      <div className="flex flex-col w-full max-w-lg min-h-[200px] bg-primary text-white p-6 rounded-md mb-3">
        {responseReceived ? (
          <div className="text-xl font-bold">{response}</div>
        ) : (
          <div className="text-xl font-bold">
            {glazing
              ? "Glazing your GitHub!"
              : "Enter a username to start glazing"}
          </div>
        )}
      </div>
      <div className="flex flex-row w-full max-w-lg text-white p-2 rounded-md justify-center mx-auto">
        <a href="https://github.com/arunnats/Github-Glazer">
          <img
            src="src//assets/github.svg"
            alt="GitHub Logo"
            className="w-12 h-12"
          />
        </a>
        <div className="flex text-xl my-auto mx-3">
          <p>
            Contact creator at{" "}
            <a
              className="text-blue-200 hover:underline"
              href="https://arunnats.com"
              target="_blank"
            >
              Arun Nats
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
