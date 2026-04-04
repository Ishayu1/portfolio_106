import { useState, useEffect } from "react";
import Buttons from "./Buttons";
import { Link } from "react-router-dom";

const CounterGame = () => {
  const [initialTime] = useState(5000);
  const [showCount, setShowCount] = useState(0);
  const [highest_count, setHighest_count] = useState(0);
  const [name, set_name] = useState("");
  const [show_name, set_show_name] = useState("");
  const [submitted_name, set_submitted_name] = useState(false);
  const [players, set_players] = useState({}); // Stores all players and their scores
  const [player_rounds, set_player_rounds] = useState([]); // Stores rounds for current player
  const [game_status, set_game_status] = useState(false);
  const [round_active, set_round_active] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        endRound();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 10, 0));
    }, 10);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- timer only keys off isRunning/timeLeft; endRound omitted intentionally
  }, [isRunning, timeLeft]);

  const startGame = () => {
    setShowCount(0);
    set_game_status(true);
    set_round_active(false);
    setIsRunning(false);
    setTimeLeft(initialTime);
    set_player_rounds([]); // Reset rounds when starting a new game
  };

  const startRound = () => {
    setShowCount(0);
    set_round_active(true);
    setIsRunning(true);
    setTimeLeft(initialTime);
  };

  const endRound = () => {
    setIsRunning(false);
    set_round_active(false);

    // Save highest count
    if (showCount > highest_count) {
      setHighest_count(showCount);
    }

    // Add round score to current player rounds
    set_player_rounds((prevRounds) => [...prevRounds, showCount]);

    setShowCount(0);
    setTimeLeft(initialTime);
  };

  const endGame = () => {
    set_game_status(false);
    set_round_active(false);
    setIsRunning(false);
    setTimeLeft(initialTime);

    // Save the rounds for the current player in the leaderboard
    set_players((prevPlayers) => ({
      ...prevPlayers,
      [show_name]: [...player_rounds], // Store all rounds for this player
    }));

    set_show_name("");
    set_name(""); 
    set_submitted_name(false);
    set_player_rounds([]);
  };

  const handleClick = () => {
    if (round_active) {
      setShowCount((prevCount) => prevCount + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    set_show_name(name);
    set_submitted_name(true);
  };

  const average = (numbers) => {
    return numbers.length > 0
      ? numbers.reduce((sum, num) => sum + num, 0) / numbers.length
      : 0;
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl px-4 pb-12 text-center sm:mt-12 md:mt-20">
      <h1 className="mb-4 text-2xl font-medium sm:mb-6 sm:text-3xl md:text-4xl">
        Test how fast you can click
      </h1>
      <h2 className="mb-6 text-xl sm:mb-8 sm:text-2xl md:text-3xl">Clicking Game</h2>

      {submitted_name && (
        <p className="mb-4 text-lg sm:text-2xl">
          Time Left: {(timeLeft / 1000).toFixed(2)} seconds
        </p>
      )}

      <div className="flex flex-col items-center space-y-4 sm:space-y-5">
        {!submitted_name ? (
          <div className="mb-4 w-full max-w-md">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center"
            >
              <label className="block text-left text-sm sm:mb-0 sm:inline sm:text-base">
                Enter Your Name:
              </label>
              <input
                type="text"
                required
                className="min-h-10 w-full rounded border border-neutral-600 bg-white px-3 py-2 text-black sm:min-w-[12rem] sm:max-w-xs sm:flex-1"
                value={name}
                onChange={(e) => set_name(e.target.value)}
              />
              <Buttons
                type="submit"
                className="w-full rounded-lg bg-cyan-600 px-6 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:w-auto"
              >
                Submit
              </Buttons>
            </form>
          </div>
        ) : (
          <>
            <p className="mb-2 mt-2 text-lg font-semibold sm:text-xl">
              Player: {show_name}
            </p>

            <Buttons
              onClick={handleClick}
              className="w-full max-w-xs rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition duration-300 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:w-auto sm:text-base"
            >
              Counter for fun:{" "}
              <span className="text-black hover:underline">{showCount}</span>
            </Buttons>

            {game_status ? (
              round_active ? (
                <Buttons
                  onClick={endRound}
                  className="w-full max-w-xs rounded-lg bg-yellow-500 px-4 py-2 font-bold text-white shadow-lg transition duration-300 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 sm:w-auto"
                >
                  End Round
                </Buttons>
              ) : (
                <Buttons
                  onClick={startRound}
                  className="w-full max-w-xs rounded-lg bg-green-500 px-4 py-2 font-bold text-white shadow-lg transition duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 sm:w-auto"
                >
                  Start Round
                </Buttons>
              )
            ) : (
              <Buttons
                onClick={startGame}
                className="w-full max-w-xs rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-lg transition duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-auto"
              >
                Start Game
              </Buttons>
            )}

            {game_status && (
              <Buttons
                onClick={endGame}
                className="w-full max-w-xs rounded-lg bg-red-600 px-4 py-2 font-bold text-white shadow-lg transition duration-300 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 sm:w-auto"
              >
                End Game
              </Buttons>
            )}

            <h3 className="mt-4 text-lg sm:mt-6 sm:text-2xl">Previous Rounds:</h3>
            <ul className="mt-2 w-full max-w-md list-inside list-disc text-left text-sm sm:text-base">
              {player_rounds.length > 0 ? (
                player_rounds.map((score, index) => (
                  <li key={index} className="break-words">
                    Round {index + 1}: {score} clicks
                  </li>
                ))
              ) : (
                <li className="list-none pl-0 text-center sm:text-left">No rounds played yet.</li>
              )}
            </ul>
          </>
        )}

        {!game_status && Object.keys(players).length > 0 && (
          <>
            <h3 className="text-lg sm:text-xl">Leaderboard</h3>
            <div className="mb-8 w-full max-w-lg sm:mb-12">
              <ol className="list-inside list-decimal space-y-3 text-left text-sm sm:text-base">
                {Object.entries(players)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, scores], index) => (
                    <li
                      key={key}
                      className="flex flex-col gap-1 border-b border-neutral-800 pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    >
                      <span className="min-w-0 break-words font-semibold">
                        {index + 1}. {key}:
                      </span>
                      <span className="shrink-0 text-neutral-400 sm:text-neutral-300">
                        {average(scores).toFixed(1)} clicks per round
                      </span>
                    </li>
                  ))}
              </ol>
            </div>
          </>
        )}
      </div>

      {submitted_name && (
        <p className="mt-6 text-lg sm:mb-6 sm:text-2xl">
          Average count: {average(player_rounds).toFixed(1)}
        </p>
      )}
      <div className="mt-8 sm:mt-12">
        <Link
          to="/"
          className="cursor-pointer text-base text-cyan-400 hover:underline sm:text-lg"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CounterGame;
