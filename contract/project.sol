// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainPolls {
    struct Poll {
        uint id;
        string question;
        string[] options;
        mapping(uint => uint) votes;
        bool isActive;
        address creator;
    }

    uint public pollCount;
    mapping(uint => Poll) public polls;
    mapping(uint => mapping(address => bool)) public hasVoted;

    event PollCreated(uint pollId, string question, address creator);
    event Voted(uint pollId, uint optionId, address voter);
    event PollClosed(uint pollId, address closer);

    modifier pollExists(uint _pollId) {
        require(_pollId < pollCount, "Poll does not exist");
        _;
    }

    modifier onlyCreator(uint _pollId) {
        require(msg.sender == polls[_pollId].creator, "Only poll creator can perform this action");
        _;
    }

    modifier isPollActive(uint _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        _;
    }

    function createPoll(string memory _question, string[] memory _options) external {
        require(_options.length >= 2, "Poll must have at least 2 options");

        Poll storage newPoll = polls[pollCount];
        newPoll.id = pollCount;
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.isActive = true;
        newPoll.creator = msg.sender;

        emit PollCreated(pollCount, _question, msg.sender);
        pollCount++;
    }

    function vote(uint _pollId, uint _optionId) external pollExists(_pollId) isPollActive(_pollId) {
        require(!hasVoted[_pollId][msg.sender], "You have already voted");
        require(_optionId < polls[_pollId].options.length, "Invalid option");

        polls[_pollId].votes[_optionId]++;
        hasVoted[_pollId][msg.sender] = true;

        emit Voted(_pollId, _optionId, msg.sender);
    }

    function closePoll(uint _pollId) external pollExists(_pollId) onlyCreator(_pollId) {
        polls[_pollId].isActive = false;
        emit PollClosed(_pollId, msg.sender);
    }

    function getPoll(uint _pollId) external view pollExists(_pollId) returns (string memory, string[] memory, uint[] memory, bool) {
        Poll storage poll = polls[_pollId];
        uint[] memory results = new uint[](poll.options.length);

        for (uint i = 0; i < poll.options.length; i++) {
            results[i] = poll.votes[i];
        }

        return (poll.question, poll.options, results, poll.isActive);
    }
}
