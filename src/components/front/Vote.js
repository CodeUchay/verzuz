import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GiBoxingGlove } from "react-icons/gi";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import moment from "moment";
import ActiveRound from "./ActiveRound";
import VotesPerRound from "./VotesPerRound";

function Vote() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState();
  const [loadingVotes, setLoadingVotes] = useState(true); // State for loading indicator

  //Battle
  const [battles, setBattles] = useState([]);
  const [currentBattle, setCurrentBattle] = useState([]);
  const [activeRound, setActiveRound] = useState();

  // Get votes
  const [allVotes, setAllVotes] = useState([]);
  const [opponent1Votes, setOpponent1Votes] = useState();
  const [opponent2Votes, setOpponent2Votes] = useState();
  const [roundVotes, setRoundVotes] = useState([]);
  const [roundVotesTable, setRoundVotesTable] = useState([]);
  const [opponent1Sums, setOpponent1Sums] = useState({});
  const [opponent2Sums, setOpponent2Sums] = useState({});

  // Accordion
  const [collapseVotes, setCollapseVotes] = useState(false);
  const [collapseRound, setCollapseRound] = useState(true);

  function logout() {
    localStorage.removeItem("verzusUserData");
    navigate("/");
  }

  useEffect(() => {
    const data = getUserData();
    if (data) {
      setUser(data);
    }
    getBattles();
  }, []);

  function saveUserData() {
    if (username.length > 3) {
      const verzusUserData = {
        username: username,
      };

      localStorage.setItem("verzusUserData", JSON.stringify(verzusUserData));
      setUser(verzusUserData);
      console.log("here>>>>>>>>.", localStorage.getItem("verzusUserData"));
    }
    if (username.length < 3) {
      alert("Username should be more than 3 letters");
    }
  }

  function getUserData() {
    const storedData = localStorage.getItem("verzusUserData");
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      return null;
    }
  }

  const getBattles = async () => {
    const querySnapshot = await getDocs(collection(db, "battles"));
    const battleList = [];
    querySnapshot.forEach((doc) => {
      battleList.push({ id: doc.id, ...doc.data() });
    });
    console.log(battleList);
    setBattles(battleList);
    console.log(id);
    for (let i = 0; i < battleList.length; i++) {
      if (battleList[i].id === id) {
        console.log("here", battleList[i]);
        setCurrentBattle(battleList[i]);
        for (let j = 0; j < battleList[i].rounds.length; j++) {
          if (battleList[i].rounds[j].active === true) {
            setActiveRound(battleList[i].rounds[j]);
            console.log("Active FRound", activeRound);
          }
        }
      }
    }
    setLoadingVotes(false); // Set loading to false when battles are fetched
  };

  const getAllVotes = async () => {
    const q = query(collection(db, "votes"), where("battleId", "==", id));

    const querySnapshot = await getDocs(q);
    console.log("votes for id: ", querySnapshot);
    const sortedList = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));

    const filteredVotes = duplicateVotesFilter(sortedList);
    setAllVotes(filteredVotes);
    console.log(filteredVotes);

    let sum1 = 0;
    let sum2 = 0;

    for (let i = 0; i < filteredVotes.length; i++) {
      sum1 += +filteredVotes[i].vote1.vote;
      sum2 += +filteredVotes[i].vote2.vote;
    }
    console.log("voter1 sum", sum1);
    console.log("voter2 sum2", sum2);
    setOpponent1Votes(sum1);
    setOpponent2Votes(sum2);
    console.log(currentBattle);

    // Calculate total votes per opponent per round
    const roundVoteTotals = {};
    filteredVotes.forEach((vote) => {
      const { round, vote1, vote2 } = vote;

      if (!roundVoteTotals[round]) {
        roundVoteTotals[round] = {
          [currentBattle.opponent1]: 0,
          [currentBattle.opponent2]: 0,
        };
      }

      roundVoteTotals[round][vote1.opponent1] += vote1.vote;
      roundVoteTotals[round][vote2.opponent2] += vote2.vote;
    });
        // Update the state with total votes per opponent per round
        setRoundVotesTable(
          Object.entries(roundVoteTotals).map(([round, totals]) => ({
            round,
            totals: Object.values(totals),
          }))
        );
        console.log(
          Object.entries(roundVoteTotals).map(([round, totals]) => ({
            round,
            totals: Object.values(totals),
          }))
        );

    // Update the state with total votes per opponent per round
    const rounds = {};
    for (let i = 0; i < filteredVotes.length; i++) {
      const round = filteredVotes[i].round.toLowerCase();
      if (!rounds[round]) {
        rounds[round] = [];
      }
      rounds[round].push(filteredVotes[i]);
    }
    setRoundVotes(rounds);
    calculateOpponentVotes(rounds);
  };
  const calculateOpponentVotes = (rounds) => {
    const opponent1Sums = {};
    const opponent2Sums = {};

    // Iterate through each round
    Object.keys(rounds).forEach((round) => {
      let sumOpponent1 = 0;
      let sumOpponent2 = 0;

      // Calculate sum of votes for each opponent in the round
      rounds[round].forEach((vote) => {
        sumOpponent1 += parseInt(vote.vote1.vote);
        sumOpponent2 += parseInt(vote.vote2.vote);
      });

      opponent1Sums[round] = sumOpponent1;
      opponent2Sums[round] = sumOpponent2;
    });

    // Update state with calculated sums
    setOpponent1Sums(opponent1Sums);
    setOpponent2Sums(opponent2Sums);
    setLoadingVotes(false);
  };
  const duplicateVotesFilter = (votes) => {
    const filteredVotes = [];
    for (let i = 0; i < votes.length; i++) {
      let isUnique = true;
      for (let j = 0; j < votes.length; j++) {
        if (
          i !== j &&
          votes[i].username.username === votes[j].username.username &&
          votes[i].round === votes[j].round &&
          votes[i].vote1.vote === votes[j].vote1.vote &&
          votes[i].vote2.vote === votes[j].vote2.vote
        ) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        filteredVotes.push(votes[i]);
      }
    }
    return filteredVotes;
  };

  useEffect(() => {
    if (currentBattle) {
      getAllVotes();
    }
  }, [currentBattle]);

  return (
    <div>
      <nav className="p-5 px-4 shadow-sm shadow-gray-300 flex justify-between items-center border-b-2 border-b-gray-400 '">
        <Link
          to="/"
          className="font-bold flex flex-row justify-center items-center text-lg"
        >
          Verzuz <GiBoxingGlove size={20} className="ml-1" />
        </Link>
        <div>
          {user ? (
            <>
              {/* <button  onClick={(e) => logout(e)} className="bg-red-500 px-2 py-1 rounded mr-2">
              logout
            </button>          */}
              <span className="bg-orange-600 px-2 py-1 rounded text-white">
                Welcome, {user.username}
              </span>
            </>
          ) : (
            <p></p>
          )}
        </div>
      </nav>
      {user ? (
        <div className="flex flex-col justify-center items-center">
          {/* Your existing JSX code */}
          {loadingVotes ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Cast Vote */}
              {activeRound ? (
                <>
                  <h1 className="text-center mt-3 p-3">
                    <span className="border-b px-20 py-2 font-bold">
                      Active Round
                    </span>
                  </h1>
                  <ActiveRound
                    activeRound={activeRound}
                    currentBattle={currentBattle}
                    user={user}
                  />
                </>
              ) : (
                <></>
              )}
              <h1 className="text-center mt-5 p-3">
                <span className="border-b px-20 py-2 font-bold">
                  Total Votes
                </span>
              </h1>
              <hr />

              {opponent1Votes > 0 || opponent2Votes > 0 ? (
                <div className="">
                  <div className="flex justify-center items-center mt-3">
                    <h1>{currentBattle.opponent1}'s Votes: </h1>
                    <p className="ml-2 rounded-full bg-white px-2 text-black font-bold">
                      {opponent1Votes}
                    </p>
                  </div>
                  <div className="flex justify-center items-center mt-3">
                    <h1>{currentBattle.opponent2}'s Votes: </h1>
                    <p className="ml-2 rounded-full bg-white px-2 text-black font-bold">
                      {opponent2Votes}
                    </p>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className=" mt-8 p-3">
                <button
                  onClick={() => setCollapseVotes(!collapseVotes)}
                  className="border px-2 flex justify-between items-center gap-2 py-2 font-bold rounded-full"
                >
                  <span className="px-5">Voters Table</span>
                  {collapseVotes ? (
                    <MdOutlineKeyboardArrowDown size={25} />
                  ) : (
                    <MdOutlineKeyboardArrowRight size={25} />
                  )}
                </button>
              </div>
              <hr />
              {/* Voting Table */}
              {collapseVotes ? (
                    <div>
                    { Object.keys(roundVotes).map((round, index) => (
                      <div key={index}>
                        <div className="flex justify-center items-center">
                        <h2 className='border-b m-2 px-2 py-1  font-semibold'>{round.charAt(0).toLocaleUpperCase() + round.substring(1)}</h2>
                        </div>
                        <table className="mt-1 mx-3 text-xs">
                          <thead>
                            <tr>
                              <th className="border p-2">No</th>
                              <th className="border p-2">Name</th>
                              <th className="border p-2">Round</th>
                              <th className="border p-2">{currentBattle.opponent1}</th>
                              <th className="border p-2">{currentBattle.opponent2}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roundVotes[round].map((vote, index) => (
                              <tr className="border-b" key={index}>
                                <td className="text-center font-semibold">{index + 1}</td>
                                <td className="px-3">{vote.username.username}</td>
                                <td className="px-3">{vote.round}</td>
                                <td className="p-3">{vote.vote1.vote}</td>
                                <td className="px-4">{vote.vote2.vote}</td>
                              </tr>
                            ))}
                            {/* Display sums at the bottom of the table */}
                            <tr>
                              <td></td>
                              <td></td>
                              <td className="text-right font-semibold">Total:</td>
                              <td className="p-3 font-semibold">{opponent1Sums[round]}</td>
                              <td className="px-4 font-semibold">{opponent2Sums[round]}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
              ) : (
                <></>
              )}
              <div className="border-b px-32 mt-5 "></div>
              <div className="mt-5 p-3">
                <button
                  onClick={() => setCollapseRound(!collapseRound)}
                  className="border px-2 flex justify-between items-center gap-2 py-2 font-bold rounded-full"
                >
                  <span className="px-5">Votes Per Round</span>
                  {collapseRound ? (
                    <MdOutlineKeyboardArrowDown size={25} />
                  ) : (
                    <MdOutlineKeyboardArrowRight size={25} />
                  )}
                </button>
              </div>
              {collapseRound ? (
                <table className="mt-1 mx-3 text-xs">
                  <thead>
                    <tr>
                      <th className="border p-2">Round</th>
                      <th className="border p-2">Song Titles</th>
                      <th className="border p-2">{currentBattle.opponent1}</th>
                      <th className="border p-2">{currentBattle.opponent2}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roundVotesTable.length > 0 ? (
                      roundVotesTable.map((round, index) => (
                        <tr className="border-b" key={index}>
                          {/* <td className="p-3">{round.round}</td> */}
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3 text-xs">
                            {currentBattle.rounds[index].name}
                          </td>
                          <td className="p-3">{round.totals[0]}</td>
                          <td className="p-3">{round.totals[1]}</td>
                        </tr>
                      ))
                    
                    ) : (
                      <></>
                    )}
                      {currentBattle.otherDetails ? 
                      currentBattle.otherDetails.map((detail, index) => ( 
                      <tr key={index}>
                      <td></td>
                      <td className="text-right font-semibold">Opponents:</td>
                      <td className="p-3 font-semibold">{detail.playerName1}</td>
                      <td className="px-3 font-semibold">{detail.playerName2}</td>
                    </tr>)):(<></>)}
                  </tbody>
                </table>
              ) : (
                <></>
              )}
            </>
          )}
          <div>
            {currentBattle.otherDetails ? (
              <ul>
                {currentBattle.otherDetails.map((detail, index) => (
                  <li key={index}>
                    <h1 className="text-center mt-5 p-3">
                      <span className="border-b px-20 py-2 font-bold">
                        Battle Details
                      </span>
                    </h1>
                    <div className="flex justify-center items-center flex-col text-gray-200 gap-1 m-2 border rounded border-gray-200 p-3">
                      <div className="flex flex-row gap-3 font-bold border-b-2 p-1 ">
                        <p>{detail.playerName1}</p>
                        <p className="font-extralight">vs</p>
                        <p>{detail.playerName2}</p>
                      </div>
                      <p className="font-extralight text-xs mt-1">by</p>
                      <p className="font-bold"> {detail.hostName}</p>
                      <p className="font-light">
                        {moment(detail.date).format("ddd, DD/MM/YYYY, h:mma z")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <></>
            )}
          </div>
          {currentBattle.winner ? (
            <div className="mt-5 border border-spacing-y-3.5 rounded bg-gray-200 text-black p-3">
              {" "}
              <span className="font-bold text-lg">
                {currentBattle.winner} {" won"} &#127881;
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-start items-center  mt-6">
          <label htmlFor="username" className="block text-left leading-6 ">
            Enter Username To Vote
          </label>
          <div className="flex justify-center items-center gap-2 mt-4">
            <input
              type="text"
              id="username"
              className={` text-black rounded-md block w-60 px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-red-100 focus:ring-red-300 ring-1 `}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              value={username}
            />
            <button
              onClick={() => saveUserData()}
              className="bg-lime-500 px-2 py-1 h-10 rounded text-white"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vote;
