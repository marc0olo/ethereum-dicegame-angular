export class PlayRound {

    numberOfPips: number;
    weiRequired: number;
    winner: string;
    second: string;
    third: string;
    placingPhaseActive: boolean;

    constructor(numberOfPips, weiRequired, winner, second, third, placingPhaseActive) {
        this.numberOfPips = numberOfPips;
        this.weiRequired = weiRequired;
        this.winner = winner;
        this.second = second;
        this.third = third;
        this.placingPhaseActive = placingPhaseActive;
    }
}