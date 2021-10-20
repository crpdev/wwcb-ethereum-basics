/*

1. Declare SPDX license information
2. Declare the pragma statement and the solidity version that must be used to compile the code
3. Declare the contract
4. Declare the global primitive variables
4. Declare the events that must be emitted from the smart-contract
5. Declare custom function modifiers that enforces restrictions
6. Declare complex data structures such as struct, arrays or enums
7. Define the constructor of the smart-contract
8. Define functions that stores information to the variables and retrieves them back to be sent

*/

// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract EventVoting {
    
    // Declare Global variables
    
    // owner is the address which deploys the code to the network
    address public owner;
    
    // emit when a new event is added by the contract owner
    event newEventAdded(string _eventName);
    
    // emit when a participant votes for an event
    event newVoteForEvent(string _eventName, address participant);
    
    // modifier that restricts only the contract owner to call the add event function
    modifier onlyAdmin() {
        require(owner == msg.sender);
        _;
    }
    
    // holds all the events that are tracked for voting
    string[] public eventList;
    
    // map to track votes per event
    mapping (string => uint256) private votesReceivedPerEvent;
    
    // map to track of addresses that had votes for an event
    mapping (address => string) private voteTracker;
    
    // upon deployment, capture the address which deploys the contract and store to owner variable
    constructor() {
        owner = msg.sender;
    }
    
    // to return the contract details such as owner and eventList
    function getContractDetails() public view returns(address, string[] memory){
      return(owner, eventList);
    }
    
    // returns the total number of votes for a specific event 
    function totalVotesForEvent(string memory _eventName) view public returns (uint256) {
     return votesReceivedPerEvent[_eventName];
    }
    
    // to add a new event to capture voting
    function addNewEvent(string memory _eventName) public onlyAdmin {
        eventList.push(_eventName);
        emit newEventAdded(_eventName);
    }
    
    // to vote for an event
    function voteForCandidate(string memory _eventName) public {
        require(msg.sender != owner, "Admin cannot vote for an event");
        require(keccak256(abi.encodePacked(voteTracker[msg.sender])) != keccak256(abi.encodePacked(_eventName)), "You've already voted for this event!");
        voteTracker[msg.sender] = _eventName;
        votesReceivedPerEvent[_eventName] += 1;
        emit newVoteForEvent(_eventName, msg.sender);
    }
    
}