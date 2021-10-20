# wwcb-ethereum-basics

The presentation deck and the workbook for the Women Who Code Blockchain - Ethereum Basics event can be found in the resources folder of this repository.

## Steps to run the application on your machine

### Pre-requisites

- Machine must have NodeJS installed
- The commands works in a linux based operating system. If you're working on windows, rename the file extension from sh to cmd
- deployToDev script has rm command which works only in linux. You might have to remove the rm command when working on Windows

1. Install the dependencies by issuing the command `npm install` in a terminal/ cmd prompt from the project root directory
2. Issue the command `startGanacheCli.sh [Linux or Mac] or startGanacheCli.cmd [Windows]` from the scripts directory to start the local Ganache ethereum network
3. Issue the command `deployToDev.sh [Linux or Mac] or deployToDev.cmd [Windows]` from the scripts directory to start the local Ganache ethereum network
4. Once the network and the contract are deployed, issue the command `npm run dev` from the project root directory for the web UI to be loaded

#### The DApp Dashboard display only the event information and does not implement functionality to add events to the blockchain. Use the Remix online IDE to perform transactions using the Web3 provider in the Deploy and run tab. View the information from the DApp dashboard web interface