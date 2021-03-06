:: Wingnut's "Because I'm Too Lazy To Keep Typing Commands" Batch File
:: Feel free to add to this and be lazy too!

@echo off
CLS

IF "%1"=="ganache" ( 
    ganache-cli -f https://data-seed-prebsc-1-s1.binance.org:8545/
) ELSE IF "%1"=="test" (
    truffle test .\test\%2.js --network develop
) ELSE IF "%1"=="migrate" (
    truffle migrate --f %2 --to %2 --network testnet --compile-all
) ELSE IF "%1"=="deploy" (
    truffle migrate --f %2 --to %2 --network bsc --compile-all
) ELSE IF "%1"=="remix" (
	remixd -s . --remix-ide https://remix.ethereum.org
) ELSE IF "%1"=="flat" (
	truffle-flattener .\contracts\%2.sol
) ELSE IF "%1"=="verify" (
	truffle run verify %2@%3 --network testnet
) ELSE IF "%1"=="validate" (
	truffle run verify %2@%3 --network bsc
) ELSE (
    ECHO Usage
    ECHO -----
	ECHO ./wing deploy XXX         - Executes a truffle migrate script with the provided number on the BSC mainnet
	ECHO ./wing flat XXX           - Flattens a Solidity contract into one file *just give filename without .sol*
    ECHO ./wing ganache            - Starts ganache-cli and forks the BSC testnet
	ECHO ./wing migrate XXX        - Executes a truffle migrate script with the provided number on the BSC testnet
	ECHO ./wing remix              - Starts remixd to connect the current folder to remix
	ECHO ./wing test XXX           - Executes a truffle test against the provided filename *do not include the .js*
	ECHO ./wing validate XXX YYY   - Verifies contract XXX at address YYY on the BSC mainnet
	ECHO ./wing verify XXX YYY     - Verifies contract XXX at address YYY on the BSC testnet
)