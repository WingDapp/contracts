const { assert } = require('chai');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const WingToken = artifacts.require('WingToken');

require('chai').use(require('chai-as-promised')).should();

function tokens(n) {
    return web3.utils.toWei(n, 'Ether');
}

contract('WingToken', ([ deployer, user ]) => {
    let token, result;
    let BN = web3.utils.BN;
    let deployerTransactions = 0, userTransactions = 0;

    async function nonce(account) {
        if (account == deployer) {
            deployerTransactions += 1;
            return await web3.eth.getTransactionCount(await deployer, 'pending') + (deployerTransactions - 1);
        } else {
            userTransactions += 1;
            return await web3.eth.getTransactionCount(await user, 'pending') + (userTransactions - 1);
        }
    }

    describe('Token Deployment Tests', async() => {
        it('1. Token can be deployed', async() => {
            token = await WingToken.new({ nonce: await nonce(deployer) });
        });
        it('2. Token has the correct details', async() => {
            result = await token.name();
            assert.equal(result.toString(), 'WingDapp Token', 'Token does not have the correct name');
            result = await token.symbol();
            assert.equal(result.toString(), 'WING', 'Token does not have the correct symbol');
            result = await token.decimals();
            assert.equal(result.toString(), '18', 'Token does not have the correct decimals');
            result = await token.totalSupply();
            assert.equal(result.toString(), '0', 'Token does not have the correct initial supply');
        });
        it('3. User cannot mint tokens', async() => {
            try {
                await token.mint(tokens('1000000'), { from: user, nonce: await nonce(user) });
            } catch (error) {
                assert(error.message.includes('Ownable: Caller is not the owner'));
                return;
            }
            assert(false);
        });
        it('4. Deployer can mint 1,000,000 tokens', async() => {
            await token.mint(tokens('1000000'), { nonce: await nonce(deployer) });
            result = await token.balanceOf(deployer);
            assert.equal(result.toString(), tokens('1000000').toString(), 'Deployer did not receive 1,000,000 tokens');
            result = await token.totalSupply();
            assert.equal(result.toString(), tokens('1000000').toString(), 'Total supply is not 1,000,000 tokens');
        });
        it('5. User cannot transfer deployers tokens', async() => {
            try {
                await token.transferFrom(deployer, user, tokens('1000000'), { from: user, nonce: await nonce(user) });
            } catch (error) {
                assert(error.message.includes('ERC20: Insufficient allowance for transfer'));
                return;
            }
            assert(false);
        });
        it('4. Deployer can approve user to transfer tokens', async() => {
            await token.approve(user, tokens('1000000'), { nonce: await nonce(deployer) });
        });
        it('6. User can transfer deployers tokens', async() => {
            await token.transferFrom(deployer, user, tokens('1000000'), { from: user, nonce: await nonce(user) });
            result = await token.balanceOf(deployer);
            assert.equal(result.toString(), '0', 'Deployer balance is not 0 tokens');
            result = await token.balanceOf(user);
            assert.equal(result.toString(), tokens('1000000').toString(), 'User balance is not 1,000,000 tokens');
            result = await token.totalSupply();
            assert.equal(result.toString(), tokens('1000000').toString(), 'Total supply is not 1,000,000 tokens');
        });
        it('7. User can transfer tokens back to deployer', async() => {
            await token.transfer(deployer, tokens('1000000'), { from: user, nonce: await nonce(user) });
            result = await token.balanceOf(deployer);
            assert.equal(result.toString(), tokens('1000000').toString(), 'Deployer balance is not 1,000,000 tokens');
            result = await token.balanceOf(user);
            assert.equal(result.toString(), '0', 'User balance is not 0 tokens');
            result = await token.totalSupply();
            assert.equal(result.toString(), tokens('1000000').toString(), 'Total supply is not 1,000,000 tokens');
        });
    });
});