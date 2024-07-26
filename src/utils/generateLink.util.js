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
const logoLink = (id) => `https://api.sofascore.app/api/v1/team/${id}/image`;

const thumbnail = {
    17: "https://res.cloudinary.com/develope-app/image/upload/v1663678239/Sports/7850957_1_nnkjut.webp",
    23: "https://res.cloudinary.com/develope-app/image/upload/v1663678178/Sports/48192c73eb16464ab1574f13ebc1c0a0bdd1d140-1280x720_fy8brg.png",
    8: "https://res.cloudinary.com/develope-app/image/upload/v1663678273/Sports/laliga-featured-image-16x9-1_umovxk.webp",
    34: "https://res.cloudinary.com/develope-app/image/upload/v1663678184/Sports/item_5_575_ukv8h4.jpg",
    35: "https://res.cloudinary.com/develope-app/image/upload/v1663678249/Sports/bundesliga-16x9.png.adapt.crop191x100.628p_fqeya4.png",
    7: "https://res.cloudinary.com/develope-app/image/upload/v1663731614/Sports/uefa-champions-league-204671998_ojqwo1.jpg",
    1: "https://res.cloudinary.com/develope-app/image/upload/v1718358004/Sports/leagues/llkrvgyltvkgamlevuyv.webp",
    133: "https://res.cloudinary.com/develope-app/image/upload/v1718358732/Sports/leagues/wyosgd4cr6cccadmhiee.jpg",
};

const defaultHighlightMatchThumbnail = (tournament) => {
    return thumbnail[tournament];
};

module.exports = {
    listMatchByRound,
    listRounds,
    playoffMatchByRound,
    matchById,
    standings,
    defaultHighlightMatchThumbnail,
    logoLink,
};
