import { ethers } from "./ethers-5.1.esm.min.js"
import { ABI, FundMeContractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundMeButton = document.getElementById("fundMeButton")
const balanceButton = document.getElementById("balance")
const withdrawButton = document.getElementById("withdrawButton")

balanceButton.onclick = balance
connectButton.onclick = connect
fundMeButton.onclick = fund
withdrawButton.onclick = withdraw

async function connect() {
    console.log("inside connect")
    if (window.ethereum !== "undefined") {
        console.log("Metamask found!")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected")
        connectButton.innerHTML = "Connected"
    } else {
        console.log("Please install and setup metamask")
    }
}
console.log("FundMe Contract ABI:", ABI)

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const address = await signer.getAddress()
        console.log(address)

        const contract = new ethers.Contract(FundMeContractAddress, ABI, signer)
        console.log(`Contract is ${contract}`)

        // const priceFeed = await contract.getPriceFeed() // Get the price feed contract
        // const latestRoundData = await priceFeed.latestRoundData() // Call latestRoundData()
        // console.log("Current ETH/USD price:", latestRoundData.toString())

        console.log(contract)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await ListenForTransactionMine(transactionResponse, provider)
            console.log("Done...........................................!")
        } catch (error) {
            console.error("Transaction error:", error.message) // More context on the error
        }
    }
}

// static function connectToContract(){
//     const ethAmount = document.getElementById("ethAmount").value
//     console.log(`Funding with ${ethAmount}`)

//     if (typeof window.ethereum !== "undefined") {
//         const provider = new ethers.providers.Web3Provider(window.ethereum)
//         const signer = provider.getSigner()

//         const address = await signer.getAddress()
//         console.log(address)

//         const contract = new ethers.Contract(FundMeContractAddress, ABI, signer)
//         console.log(`Contract is ${contract}`)

//         // const priceFeed = await contract.getPriceFeed() // Get the price feed contract
//         // const latestRoundData = await priceFeed.latestRoundData() // Call latestRoundData()
//         // console.log("Current ETH/USD price:", latestRoundData.toString())

//         console.log(contract)
// }

function ListenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining the contract: ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            // Corrected case
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations!`
            )
            resolve()
        })
    })
}

async function balance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum) // For MetaMask or browser-based provider
    const balance = await provider.getBalance(FundMeContractAddress)
    console.log(ethers.utils.formatEther(balance))
}

async function withdraw() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(FundMeContractAddress, ABI, signer)
        console.log(`Contract is ${contract}`)

        // const priceFeed = await contract.getPriceFeed() // Get the price feed contract
        // const latestRoundData = await priceFeed.latestRoundData() // Call latestRoundData()
        // console.log("Current ETH/USD price:", latestRoundData.toString())
        console.log("Signer :")
        console.log(await signer.getAddress())
        const owner = await contract.getOwner()
        console.log("Owner : ")
        console.log(owner)
        console.log("aaaaaaaaaaaaaaaaaaa")
        console.log(contract)
        try {
            const transactionResponse = await contract.withdraw()
            console.log("Transaction sent. Waiting for confirmation...")

            await ListenForTransactionMine(transactionResponse, provider)
            console.log("Done...........................................!")
        } catch (error) {
            console.error("Error withdrawing funds:", error.message) // More context on the error
        }
    }
}
// withdraw
