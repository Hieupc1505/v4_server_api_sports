const { numRounds, numRoundKnockout } = require("#utils/index");

class RoundFactory {
    static generateRoundKnockOut = (
        per,
        total,
        threePlace = false,
        turn = 1
    ) => {
        return threePlace
            ? new KnockOutWith3rdPlace(per, total).initRound(turn)
            : new KnockOut(per, total).initRound(turn);
    };
    static generateRoundNormal = (per, total, turn) => {
        return new Normal(per, total).initRound(turn);
    };
}

class Normal {
    constructor(perTeamOfTable, totalTeamKnockOut) {
        this.perTeamOfTable = perTeamOfTable;
        this.totalTeamKnockOut = totalTeamKnockOut;
    }

    initRound(turn = 1) {
        const numRoundOfTable = numRounds(this.perTeamOfTable, turn);
        return Array.from({ length: numRoundOfTable }).map((_, index) => ({
            round: index + 1,
        }));
    }
}

class KnockOut extends Normal {
    initRound(turn = 1) {
        const rounds = super.initRound(turn);
        return [
            ...rounds,
            ...roundStanderd.slice(-numRoundKnockout(this.totalTeamKnockOut)),
        ];
    }
}

class KnockOutWith3rdPlace extends KnockOut {
    initRound(turn) {
        const rounds = super.initRound(turn);
        return [
            ...rounds.slice(0, rounds.length - 1),
            ...roundExtra,
            rounds[rounds.length - 1],
        ];
    }
}

const roundStanderd = [
    {
        round: 5,
        name: "Round of 16",
        slug: "round-of-16",
    },
    {
        round: 27,
        name: "Quarterfinals",
        slug: "quarterfinals",
    },
    {
        round: 28,
        name: "Semifinals",
        slug: "semifinals",
    },
    {
        round: 29,
        name: "Final",
        slug: "final",
    },
];

const roundExtra = [
    {
        round: 50,
        name: "Match for 3rd place",
        slug: "match-for-3rd-place",
    },
];

module.exports = RoundFactory;
