import React from "react";

const HallOfFame = ({ battles }) => {
  const winnerCounts = {};

  // Count the occurrences of each winner's name
  battles.forEach((battle) => {
    const winner = battle.winner;
    if (winner) {
      winnerCounts[winner] = (winnerCounts[winner] || 0) + 1;
    }
  });

  const getWinners = () => {
    // Convert winnerCounts object to array of objects
    return Object.entries(winnerCounts).map(([winner, count]) => ({
      name: winner,
      count: count,
    }));
  };

  // Get all winners
  const allWinners = getWinners().sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <h1 className="text-center mt-3 p-3">
        <span className="border-b-2 px-16 py-2">HallOfFame &#127881;</span>
      </h1>
      <div>
        <ul className="font-light text-gray-200 ">
          {allWinners.map((winner, index) => (
            <li key={index} className="p-2 px-4 border-b-[0.01px] flex justify-center items-center gap-8 ">
              <div>{winner.name}</div><span className="text-xs font-extralight">x</span>
              <div className="flex gap-2">  <div>{winner.count} </div>
              <div>{winner.count > 1 ?  (<p>wins</p>):(<p>win</p>)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HallOfFame;
