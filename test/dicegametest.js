var DiceGame = artifacts.require("./DiceGame.sol");

// https://www.npmjs.com/package/truffle-test-utils
require('truffle-test-utils').init();
const expect = require('chai').expect;
const log = console.log;

class PlayRound {
    constructor(numberOfPips, weiRequired, winner, second, third, placingPhaseActive) {
        this.numberOfPips = numberOfPips;
        this.weiRequired = weiRequired;
        this.winner = winner;
        this.second = second;
        this.third = third;
        this.placingPhaseActive = placingPhaseActive;
    }
}

contract("DiceGame", accounts => {

    let owner = accounts[0];
    let player1 = accounts[1];
    let player2 = accounts[2];
    let player3 = accounts[3];
    let player4 = accounts[4];
    let player5 = accounts[5];
    let player6 = accounts[6];

    let diceGame;

    beforeEach(async function () {
        diceGame = await DiceGame.new();
    });
    it('should be possible to destroy contract as owner', async function () {
		await diceGame.destroy({from: owner});
    });
    it('should NOT be possible to destroy contract as owner when placing-phase is active', async function () {
        await diceGame.startPlacingPhase(1, {from: owner});
        try {
            await diceGame.destroy({from: owner});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should NOT be possible to destroy contract as regular player', async function () {
        try {
            await diceGame.destroy({from: player1});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should be possible to change gamemaster and gamemaster should be able to open and close a placing-phase', async function () {
        await diceGame.changeGamemaster(player1, {from: owner});
        await diceGame.startPlacingPhase(1, {from: player1});
        await diceGame.placeBet(6, {from: player1, value: 1});
        await diceGame.placeBet(6, {from: player2, value: 2});
        await diceGame.placeBet(6, {from: player3, value: 3});
        await diceGame.closePlacingPhase({from: player1});
    });
    it('should NOT be possible destroy contract as gamemaster', async function () {
        await diceGame.changeGamemaster(player1, {from: owner});
        try {
            await diceGame.destroy({from: player1});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should be possible to start placing-phase as owner', async function () {
        await diceGame.startPlacingPhase(1, {from: owner});
    });
    it('should NOT be possible to start placing-phase as owner when placing-phase is already running', async function () {
        await diceGame.startPlacingPhase(1, {from: owner});
        try {
            await diceGame.startPlacingPhase(1, {from: owner});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should NOT be possible to start placing-phase as a regular player', async function () {
        try {
            await diceGame.startPlacingPhase(1, {from: player1});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should NOT be possible to place a bet when betConditions are not met', async function () {
        // 1. condition: placing-phase is inactive
        try {
            await diceGame.placeBet(6, {from: player1});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
        await diceGame.startPlacingPhase(3, {from: owner});
        // 2. condition: too less ETH
        try {
            await diceGame.placeBet(6, {from: player1, value:1});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
        // 3. condition: number of pips not between 1 and 6
        try {
            await diceGame.placeBet(7, {from: player1, value:3});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
        await diceGame.placeBet(4, {from: player1, value:3});
        // 4. condition: player can only place one bet in each placing-phase
        try {
            await diceGame.placeBet(3, {from: player1, value:3});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should NOT be possible to start placing-phase as owner when placing-phase is already running', async function () {
        await diceGame.startPlacingPhase(1, {from: owner});
        try {
            await diceGame.startPlacingPhase(1, {from: owner});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should NOT be possible to start placing-phase as a regular player', async function () {
        try {
            await diceGame.startPlacingPhase(1, {from: player1});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    });
    it('should calculate results correctly', async function () {
        let roundsToPlay = 5;
        await simulateDiceGame(roundsToPlay);
        let pastPlayRoundsCount = await diceGame.pastPlayRoundsCount();
        expect(roundsToPlay).to.equal(pastPlayRoundsCount.toNumber());
    });
    
    async function simulateDiceGame(roundsToPlay) {
        for (i=0; i<roundsToPlay; i++) {
            await diceGame.startPlacingPhase(1, {from: owner});
            let betPlacedEvent = await diceGame.placeBet(6, {from: player1, value: 1000000000000000000});
            assert.web3Event(betPlacedEvent, {
                event: 'BetPlaced',
                args: {
                  player: '0xf17f52151ebef6c7334fad080c5704d77216b732',
                  numberOfPips: 6,
                  weiBalance: 1000000000000000000
                }
              }, 'BetPlaced-event is emitted');
            await diceGame.placeBet(3, {from: player2, value: 1000000000000000000});
            await diceGame.placeBet(1, {from: player3, value: 1000000000000000000});
            await diceGame.placeBet(2, {from: player4, value: 1000000000000000000});
            await diceGame.placeBet(4, {from: player5, value: 1000000000000000000});
            await diceGame.placeBet(5, {from: player6, value: 1000000000000000000});
            await diceGame.closePlacingPhase({from: owner});
            let playRound = await getPlayRound(i);
            log("Number of pips: " + playRound.numberOfPips);
            if(playRound.numberOfPips == 6) {
                await checkWinnersAndClaimRewards(playRound, player1, player6, player5, player3);
            } else if (playRound.numberOfPips == 3) {
                await checkWinnersAndClaimRewards(playRound, player2, player4, player5, player1);
            } else if (playRound.numberOfPips == 1) {
                await checkWinnersAndClaimRewards(playRound, player3, player4, player2, player6);
            } else if (playRound.numberOfPips == 2) {
                await checkWinnersAndClaimRewards(playRound, player4, player2, player3, player5);
            } else if (playRound.numberOfPips == 4) {
                await checkWinnersAndClaimRewards(playRound, player5, player2, player6, player1);
            } else if (playRound.numberOfPips == 5) {
                await checkWinnersAndClaimRewards(playRound, player6, player1, player5, player2);
            }
        }
    }

    async function getPlayRound(pastRoundId) {
        let pastPlayRound = await diceGame.pastPlayRounds.call(pastRoundId);
        let playRound = new PlayRound(pastPlayRound[0].toNumber(),pastPlayRound[1].toNumber(),pastPlayRound[2], pastPlayRound[3], pastPlayRound[4], pastPlayRound[5]);
        return playRound;
    }

    async function checkWinnersAndClaimRewards(playRound, expectedWinner, expectedSecond, expectedThird, expectedLoser) {
        log("Winner: " + playRound.winner);
        log("Second: " + playRound.second);
        log("Third: " + playRound.third);
        expect(expectedWinner).to.equal(playRound.winner);
        expect(expectedSecond).to.equal(playRound.second);
        expect(expectedThird).to.equal(playRound.third);
        let rewardWinner = await diceGame.rewards.call(expectedWinner);
        expect(3600000000000000000).to.equal(rewardWinner.toNumber());
        let rewardSecond = await diceGame.rewards.call(expectedSecond);
        expect(1800000000000000000).to.equal(rewardSecond.toNumber());
        let rewardThird = await diceGame.rewards.call(expectedThird);
        expect(600000000000000000).to.equal(rewardThird.toNumber());
        
        await diceGame.claimReward({from: expectedWinner});
        await diceGame.claimReward({from: expectedSecond});
        await diceGame.claimReward({from: expectedThird});
        // claiming not possible without rewards
        try {
            await diceGame.claimReward({from: expectedLoser});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
        // should fail when trying to claim again
        try {
            await diceGame.claimReward({from: expectedWinner});
            assert.fail('should fail');
        } catch(error){
            assertInvalidOpCode(error);
        }
    }

    function assertInvalidOpCode(error) {
		assert(
			error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
			'Method should have reverted'
		);
	}
})