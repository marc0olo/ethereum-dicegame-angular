export class PlayRound {
    numberOfPips: number;
    ethRequired: number;
    winner: string;
    second: string;
    third: string;
    placingPhaseActive: boolean;

    constructor(numberOfPips, ethRequired, winner, second, third, placingPhaseActive) {
        this.numberOfPips = numberOfPips;
        this.ethRequired = ethRequired;
        this.winner = winner;
        this.second = second;
        this.third = third;
        this.placingPhaseActive = placingPhaseActive;
    }
}
