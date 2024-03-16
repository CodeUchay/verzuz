import React, { useEffect, useState } from 'react';

const VotesPerRound = ({ allVotes, currentBattle, setLoadingVotes }) => {
  const [roundVotes, setRoundVotes] = useState([]);
  const [opponent1Sums, setOpponent1Sums] = useState({});
  const [opponent2Sums, setOpponent2Sums] = useState({});
  // const [loadingVotes, setLoadingVotes] = useState(true); 

  useEffect(() => {
    filterVotes();
  }, []);


  const filterVotes = () => {
    const filterAllVotes = [];

    for (let i = 0; i < allVotes.length; i++) {
      let isUnique = true;
      for (let j = 0; j < allVotes.length; j++) {
        if (i !== j && 
            allVotes[i].username.username === allVotes[j].username.username &&
            allVotes[i].round === allVotes[j].round &&
            allVotes[i].vote1.vote === allVotes[j].vote1.vote &&
            allVotes[i].vote2.vote === allVotes[j].vote2.vote) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        filterAllVotes.push(allVotes[i]);
      }
    }

    const rounds = {};
    for (let i = 0; i < filterAllVotes.length; i++) {
      const round = filterAllVotes[i].round.toLowerCase();
      if (!rounds[round]) {
        rounds[round] = [];
      }
      rounds[round].push(filterAllVotes[i]);
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
  };

  return (
    < >
      { Object.keys(roundVotes).map((round, index) => (
        <div key={index}>
          <h2 className='text-center'>{round.charAt(0).toLocaleUpperCase() + round.substring(1)}</h2>
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
    </>
  );
};

export default VotesPerRound;

// import React, { useEffect, useState } from 'react';

// const VotesPerRound = ({ allVotes, currentBattle }) => {
//   const [roundVotes, setRoundVotes] = useState([]);
//   const [opponent1Sums, setOpponent1Sums] = useState({});
//   const [opponent2Sums, setOpponent2Sums] = useState({});

//   useEffect(() => {
//     filterVotes();
//   }, []);

//   const filterVotes = () => {
//     const filterAllVotes = []
//     for(let i = 0; i < allVotes.length; i++){
//       for(let j = 0; j < allVotes.length; j++){
//         if (allVotes[i].username.username !== allVotes[j].username.username || allVotes[i].round !== allVotes[j].round || allVotes[i].vote1.vote !== allVotes[j].vote1.vote || allVotes[i].vote2.vote !== allVotes[j].vote2.vote){
//           filterAllVotes.push();
//         }
//       }
//     }


//     const rounds = {};
//     for (let i = 0; i < allVotes.length; i++) {
//       const round = allVotes[i].round.toLowerCase();
//       if (!rounds[round]) {
//         rounds[round] = [];
//       }
//       rounds[round].push(allVotes[i]);
//     }
//     setRoundVotes(rounds);
//     calculateOpponentVotes(rounds);
//   };


//   const calculateOpponentVotes = (rounds) => {
//     const opponent1Sums = {};
//     const opponent2Sums = {};

//     // Iterate through each round
//     Object.keys(rounds).forEach((round) => {
//       let sumOpponent1 = 0;
//       let sumOpponent2 = 0;

//       // Calculate sum of votes for each opponent in the round
//       rounds[round].forEach((vote) => {
//         sumOpponent1 += parseInt(vote.vote1.vote);
//         sumOpponent2 += parseInt(vote.vote2.vote);
//       });

//       opponent1Sums[round] = sumOpponent1;
//       opponent2Sums[round] = sumOpponent2;
//     });

//     // Update state with calculated sums
//     setOpponent1Sums(opponent1Sums);
//     setOpponent2Sums(opponent2Sums);
//   };

//   return (
//     <>
//       {Object.keys(roundVotes).map((round, index) => (
//         <div key={index}>
//           <h2>{round}</h2>
//           <table className="mt-1 mx-3 text-xs">
//             <thead>
//               <tr>
//                 <th className="border p-2">No</th>
//                 <th className="border p-2">Name</th>
//                 <th className="border p-2">Round</th>
//                 <th className="border p-2">{currentBattle.opponent1}</th>
//                 <th className="border p-2">{currentBattle.opponent2}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {roundVotes[round].map((vote, index) => (
//                 <tr className="border-b" key={index}>
//                   <td className="text-center font-semibold">{index + 1}</td>
//                   <td className="px-3">{vote.username.username}</td>
//                   <td className="px-3">{vote.round}</td>
//                   <td className="p-3">{vote.vote1.vote}</td>
//                   <td className="px-4">{vote.vote2.vote}</td>
//                 </tr>
//               ))}
//               {/* Display sums at the bottom of the table */}
//               <tr>
//                 <td></td>
//                 <td></td>
//                 <td className="text-right font-semibold">Total:</td>
//                 <td className="p-3 font-semibold">{opponent1Sums[round]}</td>
//                 <td className="px-4 font-semibold">{opponent2Sums[round]}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </>
//   );
// };

// export default VotesPerRound;

// import React, { useEffect, useState } from 'react';

// const VotesPerRound = ({ allVotes, currentBattle }) => {
//   const [roundVotes, setRoundVotes] = useState([]);

//   useEffect(() => {
//     filterVotes();
//   }, []);

//   const filterVotes = () => {
//     const rounds = {};
//     for (let i = 0; i < allVotes.length; i++) {
//       const round = allVotes[i].round.toLowerCase();
//       if (!rounds[round]) {
//         rounds[round] = [];
//       }
//       rounds[round].push(allVotes[i]);
//     }
//     setRoundVotes(rounds);
//   };

//   return (
//     <>
//       {Object.keys(roundVotes).map((round, index) => (
//         <div key={index}> 
//           <h2>{round}</h2>
//           <table className="mt-1 mx-3 text-xs">
//             <thead>
//               <tr>
//                 <th className="border p-2">No</th>
//                 <th className="border p-2">Name</th>
//                 <th className="border p-2">Round</th>
//                 <th className="border p-2">{currentBattle.opponent1}</th>
//                 <th className="border p-2">{currentBattle.opponent2}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {roundVotes[round].map((vote, index) => (
//                 <tr className="border-b" key={index}>
//                   <td className="text-center font-semibold">{index + 1}</td>
//                   <td className="px-3">{vote.username.username}</td>
//                   <td className="px-3">{vote.round}</td>
//                   <td className="p-3">{vote.vote1.vote}</td>
//                   <td className="px-4">{vote.vote2.vote}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div>{currentBattle.opponent1} sum</div>
//           <div>{currentBattle.opponent} sum</div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default VotesPerRound;

// import React, {useEffect, useState} from 'react'
// import { GiH2O } from 'react-icons/gi';


// const VotesPerRound = ({ allVotes, currentBattle }) => {

// const [round1Votes, setRound1Votes] = useState([]);
// const [round2Votes, setRound2Votes] = useState([]);
// const [round3Votes, setRound3Votes] = useState([]);
// const [round4Votes, setRound4Votes] = useState([]);
// const [round5Votes, setRound5Votes] = useState([]);
// const [round6Votes, setRound6Votes] = useState([]);
// const [round7Votes, setRound7Votes] = useState([]);
// const [round8Votes, setRound8Votes] = useState([]);
// const [round9Votes, setRound9Votes] = useState([]);
// const [round10Votes, setRound10Votes] = useState([]);


// const filterVotes = () =>{
//   const round1Votes = []
//   const round2Votes = []
//   const round3Votes = []
//   const round4Votes = []
//   const round5Votes = []
//   const round6Votes = []
//   const round7Votes = []
//   const round8Votes = []
//   const round9Votes = []
//   const round10Votes = []


//   for(let i = 0; i<allVotes.length; i++){
//     if(allVotes[i].round.toLowerCase() === "round 1"){
//       round1Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 2"){
//       round2Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 3"){
//       round3Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 4"){
//       round4Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 5"){
//       round5Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 6"){
//       round6Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 7"){
//       round7Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 8"){
//       round8Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 9"){
//       round9Votes.push(allVotes[i])
//     }
//     if(allVotes[i].round.toLowerCase() === "round 10"){
//       round10Votes.push(allVotes[i])
//     }
//   }

//   setRound1Votes(round1Votes);
//   setRound2Votes(round2Votes);
//   setRound3Votes(round3Votes);
//   setRound4Votes(round4Votes);
//   setRound5Votes(round5Votes);
//   setRound6Votes(round6Votes);
//   setRound7Votes(round7Votes);
//   setRound8Votes(round8Votes);
//   setRound9Votes(round9Votes);
//   setRound10Votes(round10Votes);

// }

// useEffect(()=> {
//   filterVotes()
// }, [])
//   return (
//     <>
//     <div>Total Votes </div>
//     {round1Votes.length > 1 ? ( 
//     <div><h2>Round 1</h2>
//     <table className="mt-1 mx-3 text-xs">
//             <thead>
//               <tr>
//                 <th className="border p-2">No</th>
//                 <th className="border p-2"> Name</th>
//                 <th className="border p-2"> Round</th>
//                 <th className="border p-2">{currentBattle.opponent1}</th>
//                 <th className="border p-2">{currentBattle.opponent2}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {
//                 round1Votes.map((vote, index) => (
//                   <tr className="border-b" key={index}>
//                     <td className="text-center font-semibold">{index + 1}</td>
//                     <td className="px-3">{vote.username.username}</td>
//                     <td className="px-3">{vote.round}</td>
//                     <td className="p-3">{vote.vote1.vote}</td>
//                     <td className="px-4">{vote.vote2.vote}</td>
//                   </tr>
//                 ))
//                 }
//             </tbody>
//           </table></div>):(<></>)}
// </>
//   )
// }

// export default VotesPerRound;