import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FaPen, FaTrashAlt } from "react-icons/fa";

const AdminRoundList = ({ battleId, battle, index }) => {
  const [rounds, setRounds] = useState(battle.rounds);
  const [roundName, setRoundName] = useState(false);
  const [song1, setSong1] = useState("");
  const [song2, setSong2] = useState("");
  const [status, setStatus] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  // Get votes
  const [allVotes, setAllVotes] = useState([]);

  // Accordion
  const [collapseVotes, setCollapseVotes] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteVote, setSelectedDeleteVote] = useState([]);

  const createRoundName = async (e, roundIndex) => {
    const name = song1 + " vs " + song2;
    e.preventDefault();
    console.log("indexx", roundIndex);
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].name = name;
    setRounds(updatedRounds);
    const nameRef = doc(db, "battles", `${battleId}`);
    await updateDoc(nameRef, {
      rounds: updatedRounds,
    });
  };

  const setActiveRound = async (e, roundIndex, roundStatus) => {
    e.preventDefault();
    setStatus(true);
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].active = !roundStatus;
    setRounds(updatedRounds);
    const nameRef = doc(db, "battles", `${battleId}`);
    await updateDoc(nameRef, {
      rounds: updatedRounds,
    });
    //onUpdate();
    setStatus(false);
  };

  const createWinner = async () => {
    const winnerRef = doc(db, "battles", battleId);

    await updateDoc(winnerRef, {
      winner: winnerName,
    }).then(function () {
      console.log("Winner ", winnerName, " Updated");
      setWinnerName("");
      alert(
        "Winner " +
          winnerName +
          " Updated for " +
          battle.opponent1 +
          " vs " +
          battle.opponent2
      );
    });
  };

  const getVotes = async () => {
    const q = query(collection(db, "votes"), where("battleId", "==", battleId));

    const querySnapshot = await getDocs(q);
    console.log("votes for id: ", querySnapshot);
    const sortedList = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));

    setAllVotes(sortedList);
    console.log(sortedList);
  };

  useEffect(() => {
    getVotes();
  }, []);

  const deleteVoteConfirmation = (vote) => {
    setDeleteModal(true);
    setSelectedDeleteVote(vote);
  };
  const Modal = () => {
    console.log("voteeee", selectedDeleteVote);
    return (
      <div>
        {/* Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-black opacity-5"></div>

            {/* Modal content */}
            <div className={` rounded-lg p-5 shadow-md  relative`}>
              <h2 className="text-lg text-center mb-2">
                Are you sure you want to delete <br />
                <span className="font-semibold">
                  {" "}
                  {selectedDeleteVote.username.username + " 's"}{" "}
                  {selectedDeleteVote.vote1.vote}
                  {"-"}
                  {selectedDeleteVote.vote2.vote}
                </span>{" "}
                Vote?{" "}
              </h2>
              <div className="flex flex-row justify-center gap-5 text-lg">
                <button
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => {
                    handleDeleteVote(selectedDeleteVote.id);
                    setDeleteModal(false);
                  }}
                >
                  Delete
                </button>
                <button
                  className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-500"
                  onClick={() => {
                    setDeleteModal(false);
                    //stemAdded(true);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const handleDeleteVote = async (voteId) => {
    console.log(voteId);
    try {
      await deleteDoc(doc(db, "votes", voteId));
      getVotes();
      alert("Vote Deleted");
    } catch (error) {
      console.error("Error deleting vote", error);
      alert("Error Deleting Vote");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div>
        {rounds.map((round, index) => (
          <li
            className="text-sm w-60 py-3 border-b text-center flex flex-col justify-center items-center gap-1"
            key={index}
          >
            <div className="text-md font-semibold">{round.round}</div>
            {round.name ? (
              <div>
                {/* Active:{" "} */}
                {round.active == false ? (
                  <button
                    disabled={status}
                    onClick={(e) => setActiveRound(e, index, round.active)}
                    className="bg-lime-600 px-2 py-1 mt-3 rounded text-white"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    disabled={status}
                    onClick={(e) => setActiveRound(e, index, round.active)}
                    className="bg-red-600 px-2 py-1 mt-3 rounded text-white"
                  >
                    Stop
                  </button>
                )}
              </div>
            ) : (
              <></>
            )}

            <div>
              {round.name ? (
                <p> Song Titles: {round.name}</p>
              ) : (
                <div className=" flex flex-col p-3 justify-items-center gap-1">
                  <h2>
                    {" "}
                    <u>Create Song Titles </u>
                  </h2>
                  <div className="flex flex-col mt-2 gap-2">
                    <label htmlFor="Opponent1">{battle.opponent1}'s Song</label>
                    <input
                      onChange={(e) => setSong1(e.target.value)}
                      type="text"
                      className="px-2 py-1 rounded  bg-black border text-white"
                    />
                    <p>
                      {" "}
                      <b> vs </b>
                    </p>
                    <label htmlFor="Opponent2">{battle.opponent2}'s Song</label>

                    <input
                      onChange={(e) => setSong2(e.target.value)}
                      type="text"
                      className="px-2 py-1 rounded  bg-black border text-white"
                    />
                    <button
                      onClick={(e) => createRoundName(e, index)}
                      className="bg-cyan-600 px-2 py-2 mt-1 text-xs rounded text-white"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
        <div className=" flex flex-row mt-3 p-3 justify-items-center gap-2">
          <input
            onChange={(e) => setWinnerName(e.target.value)}
            value={winnerName}
            type="text"
            className="p-1 px-2 rounded w-28 bg-black border text-white"
            placeholder="Username"
          />
          <button
            onClick={(e) => createWinner()}
            className="bg-orange-500 py-1 px-2 text-xs rounded text-white"
          >
            Update Winner
          </button>
        </div>
      </div>
      <div >
        <div className=" mt-8 p-3 flex flex-row justify-center items-center">
          <button
            onClick={() => setCollapseVotes(!collapseVotes)}
            className="border px-2 flex justify-between items-center gap-2 py-2 font-bold rounded-full"
          >
            <span className="px-5">
              {battle.opponent1} vs {battle.opponent2} Table
            </span>
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
          <table className="mt-1 mx-3 text-[0.5rem]">
            <thead>
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2"> Name</th>
                <th className="border p-2"> Round</th>
                <th className="border p-2">{battle.opponent1}</th>
                <th className="border p-2">{battle.opponent2}</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allVotes.length > 1 ? (
                allVotes.map((vote, index) => (
                  <tr className="border-b" key={index}>
                    <td className="text-center font-semibold">{index + 1}</td>
                    <td className="px-3">{vote.username.username}</td>
                    <td className="px-3">{vote.round}</td>
                    <td className="p-3">{vote.vote1.vote}</td>
                    <td className="px-4">{vote.vote2.vote}</td>

                    <td className="px-4">
                      <button
                        onClick={() => deleteVoteConfirmation(vote)}
                        className=" flex justify-center text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white"
                      >
                        <FaTrashAlt />
                      </button>
                      {deleteModal && <Modal />}
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AdminRoundList;
