import chalk from "chalk";
import figlet from "figlet";
import { Keypair } from "@solana/web3.js";
import {askQuestions} from "./Inquirer/index.js";
import { publicKey, secretKey, tresurePublicKey, tresureSecretKey } from "./config.js";
import {getWalletBalance,transferSOL,airDropSol, getWallet} from "./adapters/solana.js";
import { getReturnAmount, totalAmtToBePaid, randomNumber } from "./utils/helper.js";

const userWallet = getWallet(secretKey);
const treasuryWallet = getWallet(tresureSecretKey);

const init = () => {
    console.log(
        chalk.green(
        figlet.textSync("SOL Roulette", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default"
        })
        )
    );
    console.log(chalk.yellow`The max bidding amount is 2.5 SOL here`);
};

const gameExecution=async ()=>{
    init();
    const generateRandomNumber=randomNumber(1,5);
    const answers=await askQuestions(userWallet);
    if(answers.RANDOM){
        const paymentSignature=await transferSOL(userWallet,treasuryWallet,totalAmtToBePaid(answers.SOL))
        console.log(`Signature of payment for playing the game`,chalk.green`${paymentSignature}`);
        if(answers.RANDOM===generateRandomNumber){
            await airDropSol(treasuryWallet,getReturnAmount(answers.SOL,parseFloat(answers.RATIO)));
            const prizeSignature=await transferSOL(treasuryWallet,userWallet,getReturnAmount(answers.SOL,parseFloat(answers.RATIO)))
            console.log(chalk.green`Your guess is absolutely correct`);
            console.log(`Here is the price signature `,chalk.green`${prizeSignature}`);
        }else{
            console.log(chalk.yellowBright`Better luck next time`)
        }
    }
}

gameExecution();