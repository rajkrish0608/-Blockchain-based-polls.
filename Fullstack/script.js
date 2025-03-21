const contractAddress = "0xc620535770a41c5f9fd05d07e3F3e18eFB54B50B";
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "feedback",
				"type": "string"
			}
		],
		"name": "FeedbackCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "feedback",
				"type": "string"
			}
		],
		"name": "createFeedback",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getFeedback",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask to interact with this dApp.");
    }
});

async function createPoll() {
    const question = document.getElementById("poll-question").value;
    if (!question) {
        alert("Please enter a poll question.");
        return;
    }
    const accounts = await web3.eth.getAccounts();
    await contract.methods.createPoll(question).send({ from: accounts[0] });

    document.getElementById("current-question").innerText = question;
    document.getElementById("poll-question").value = "";

    animateElement(".btn.primary");
}

async function vote(option) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.vote(option).send({ from: accounts[0] });

    alert("Vote submitted!");
    animateElement(".btn.vote");
}

async function getResults() {
    const result = await contract.methods.getResults().call();
    document.getElementById("result").innerText = `✅ Option 1: ${result[0]} votes | ✅ Option 2: ${result[1]} votes`;
    
    animateElement(".btn.result-btn");
}

function animateElement(buttonClass) {
    const button = document.querySelector(buttonClass);
    button.style.transform = "scale(1.1)";
    setTimeout(() => {
        button.style.transform = "scale(1)";
    }, 200);
}
