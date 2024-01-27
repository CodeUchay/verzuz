import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    db,
    storage,
  } from "../firebase";
  import {
    addDoc,
    collection,
  } from "firebase/firestore";

function Add() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [round, setRound] = useState("");
  const [password, setPassword] = useState("");

  const rounds = [];
  const code = "cunt";
  const navigate = useNavigate();

  const createBattle = async (
    e
  ) => {
    e.preventDefault()
    if (password === code){
        for(let i = 1; i<=round; i++){
            rounds.push({name: `Round${i}`, active: 0})
        }
       console.log("rounds created")    
        try {
          const uniqueId = generateUniqueId(5); // Implement your logic to generate a unique ID
          // const barcodeUrl = await generateQRCode(uniqueId); // Implement your logic to generate the barcode URL
    
         
          await addDoc(collection(db, "battles"), {
            opponent1: name1,
            opponent2: name2,
            rounds: rounds,
            battleId: uniqueId,
          });
    
          console.log("Battle created successfully!");
          alert(`Battle ${name1 + " vs " + name2} Created Successfully!`)
          navigate("/")
        } catch (error) {
          console.error("Error creating event:", error);
        }  
    }

    else{
        alert("You're not authorized")
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
      <nav className="p-5 flex justify-between items-center">
      <Link to="/" className="">
      Verzuz
    </Link>
      </nav>
      <hr />
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
                  Opponent 1
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
                  Opponent 2
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
