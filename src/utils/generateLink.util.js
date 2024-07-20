const server = `https://www.sofascore.com/api/v1/unique-tournament`;

const listMatchByRound = (tour, season, round) =>
    `${server}/${tour}/season/${season}/events/round/${round}`;
const listRounds = (tour, season) =>
    `${server}/${tour}/season/${season}/rounds`;
const playoffMatchByRound = (tour, season, round, round_slug) =>
    `${server}/${tour}/season/${season}/events/round/${round}/slug/${round_slug}`;
const matchById = (id) => `https://www.sofascore.com/api/v1/event/${id}`;
const standings = (tour, season) =>
    `${server}/${tour}/season/${season}/standings/total`;

module.exports = {
    listMatchByRound,
    listRounds,
    playoffMatchByRound,
    matchById,
    standings,
};
