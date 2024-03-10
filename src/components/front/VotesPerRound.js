import React, {useState} from 'react'


const VotesPerRound = ({ allVotes }) => {

const [round1Votes, setRound1Votes] = useState({});
const [round2Votes, setRound2Votes] = useState({});
const [round3Votes, setRound3Votes] = useState({});
const [round4Votes, setRound4Votes] = useState({});
const [round5Votes, setRound5Votes] = useState({});
const [round6Votes, setRound6Votes] = useState({});
const [round7Votes, setRound7Votes] = useState({});
const [round8Votes, setRound8Votes] = useState({});
const [round9Votes, setRound9Votes] = useState({});
const [round10Votes, setRound10Votes] = useState({});



  return (
    <>
    <div>Total Votes 
        
        
    </div>

    <div> {allVotes.length > 1 ? (
                allVotes.map((vote, index) => (
                  <tr className="border-b" key={index}>
                    <td className="text-center font-semibold">{index + 1}</td>
                    <td className="px-3">{vote.username.username}</td>
                    <td className="px-3">{vote.round}</td>
                    <td className="p-3">{vote.vote1.vote}</td>
                    <td className="px-4">{vote.vote2.vote}</td>
                  </tr>
                ))
              ) : (
                <></>
              )}</div>
</>
  )
}

export default VotesPerRound;