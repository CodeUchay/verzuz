import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { GiBoxingGlove } from "react-icons/gi";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import DateTimePicker from "react-datetime-picker";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

function Add() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [playerName1, setPlayerName1] = useState("");
  const [playerName2, setPlayerName2] = useState("");
  const [round, setRound] = useState("");
  const [password, setPassword] = useState("");
  const [addMore, setAddMore] = useState(false);
  const [hostName, setHostName] = useState("");

  //Date Picker
  const [dateValue, onChange] = useState(new Date());
  let inputProps = {
    className:
      "rounded mt-2 bg-white text-sm px-3 h-10 focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 ",
  };
  var yesterday = moment().subtract(1, "day");
  var valid = function (current) {
    return current.isAfter(yesterday);
  };
  // Voting type
  const [voteType, setVoteType] = useState('split')

  const clearAddMore = () => {
    setAddMore(!addMore);
    setPlayerName1("");
    setPlayerName2("");
    setHostName("");
    onChange("");
    console.log(dateValue);
  };

  const rounds = [];
  const code = "cunt";
  const navigate = useNavigate();

  const createBattle = async (e) => {
    e.preventDefault();
    if (password === code) {
      for (let i = 1; i <= round; i++) {
        rounds.push({ round: `Round ${i}`, name: "", active: 0 });
      }
      console.log("rounds created");
      try {
        const uniqueId = generateUniqueId(5); // Implement your logic to generate a unique ID
        // const barcodeUrl = await generateQRCode(uniqueId); // Implement your logic to generate the barcode URL

        const otherDetails = [];
        if (addMore) {
          otherDetails.push({
            playerName1: playerName1,
            playerName2: playerName2,
            hostName: hostName,
            date: dateValue.toISOString(),
          });
        }

        await addDoc(collection(db, "battles"), {
          opponent1: name1,
          opponent2: name2,
          rounds: rounds,
          voteType: voteType,
          battleId: uniqueId,
          otherDetails: otherDetails,
        });

        console.log("Battle created successfully!");
        alert(`Battle ${name1 + " vs " + name2} Created Successfully!`);
        navigate("/");
      } catch (error) {
        console.error("Error creating event:", error);
      }
    } else {
      alert("You're not authorized");
    }
  };
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    setRound((prevRound) => Math.min(10, Math.max(3, prevRound + delta)));
  };
  const generateUniqueId = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    console.log("ID GENERATED successfully!:  " + result);
    return result;
  };

  return (
    <div>
      <nav className="p-5 px-4 shadow-sm shadow-gray-300 flex justify-between items-center border-b-2 border-b-gray-400 '">
        <Link
          to="/"
          className="font-bold flex flex-row justify-center items-center text-lg"
        >
          Verzuz <GiBoxingGlove size={20} className="ml-1" />
        </Link>
      </nav>
      <div className="m-5 lg:px-16 lg:py-5 text-white">
        <div className=" mx-auto mt-5 text-xs flex flex-col gap-2 rounded p-4 lg:p-7 w-full max-w-sm shadow-xl">
          <div className="flex justify-center items-center text-lg lg:mb-3">
            <h1>
              Create <span className="text-orange-400">Battle</span>{" "}
            </h1>
          </div>
          <hr className="mb-3" />
          <form onSubmit={(e) => createBattle(e)}>
            <div className="mb-6 flex gap-3">
              <div>
                <label htmlFor="name1" className="block text-sm leading-6 ">
                  Artist Name 1
                </label>
                <input
                  type="text"
                  className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                  onChange={(e) => setName1(e.target.value)}
                  value={name1}
                  required
                />
              </div>
              <span className="mt-10 text-md font-bold">Vs</span>
              <div>
                <label htmlFor="name2" className="block text-sm leading-6 ">
                  Artist Name 2
                </label>
                <input
                  type="text"
                  className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                  onChange={(e) => setName2(e.target.value)}
                  value={name2}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="round" className="block text-sm leading-6 ">
                Rounds
              </label>
              <input
                type="number"
                id="round"
                onWheel={(e) => handleWheel(e)}
                className={`mt-2 text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-300 ring-1 `}
                onChange={(e) =>
                  setRound(Math.min(10, Math.max(3, e.target.value)))
                }
                value={round}
                min="3"
                max="10"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="votingType" className="mb-2 block text-sm leading-6 ">
                Voting Type
              </label>
              <div className="flex flex-row justify-start items-center gap-2 text-sm border accent-orange-600 rounded border-gray-400 px-2 h-10">
              <input type="radio" id="split" name="vote_type" value="split" defaultChecked={voteType === 'split'} onClick={() => setVoteType('split')}/>
              <label htmlFor="split">Split 10 </label>
              <input type="radio" id="binary" name="vote_type" value="binary" disabled onClick={() => setVoteType('binary')} />
              <label htmlFor="binary">Binary</label>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center mb-6 ">
              <div
                onClick={() => 
                  clearAddMore()
                }
                className="cursor-pointer px-2 text-sm flex justify-start items-center gap-2 py-1 bg-orange-600 rounded-full"
              >
                <span className="px-2">Add More Details</span>
                {addMore ? (
                  <FiMinusCircle size={25} />
                ) : (
                  <FiPlusCircle size={25} />
                )}
              </div>
            </div>
            <div>
              {addMore ? (
                <div>
                  <div className="mb-6 flex gap-3">
                    <div>
                      <label
                        htmlFor="playerName1"
                        className="block text-sm leading-6 "
                      >
                        Player 1
                      </label>
                      <input
                        type="text"
                        className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                        onChange={(e) => setPlayerName1(e.target.value)}
                        value={playerName1}
                      />
                    </div>
                    <span className="mt-10 text-md font-bold">Vs</span>
                    <div>
                      <label
                        htmlFor="playerName2"
                        className="block text-sm leading-6 "
                      >
                        Player 2
                      </label>
                      <input
                        type="text"
                        className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                        onChange={(e) => setPlayerName2(e.target.value)}
                        value={playerName2}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="hostName"
                      className="block text-sm leading-6 "
                    >
                      Host Name
                    </label>
                    <input
                      type="text"
                      className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                      onChange={(e) => setHostName(e.target.value)}
                      value={hostName}
                    />
                  </div>
                  <div>
                    {/* <DateTimePicker onChange={onChange} value={value} /> */}
                  </div>
                  <label htmlFor="date" className="block text-sm leading-6 ">
                    Date
                  </label>
                  <Datetime
                    value={dateValue}
                    onChange={onChange}
                    className="text-black"
                    inputProps={inputProps}
                    isValidDate={valid}
                  />

                  <hr className="my-6 mx-4 border-gray-800" />
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm leading-6 ">
                Password
              </label>
              <input
                type="password"
                className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex justify-center rounded-lg text-sm py-2.5 px-4 bg-orange-600 hover:bg-orange-700 w-full"
            >
              <span className="text-white">Create</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add;
