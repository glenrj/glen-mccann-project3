// global variables
const tournament = {
    name: '',
    numOfPlayers: 8,
    round: 0,
    players: [],
    eliminated: []
}

tournament.setup = () => {
    if (tournament.numOfPlayers % 2 === 0) {
        // update tournament name
        tournament.name = $('#tournamentName').val();
        // update page header w/ tournament name
        if (tournament.name !== '') {
            $('h1').text(tournament.name);
        }

        // add player names to array
        tournament.players = [];

        for (i = 0; i < tournament.numOfPlayers; i++) {
            tournament.players.push($(`#player${i + 1}`).val());
        }
        // remove setup section from page after setup is complete
        $('.setup').remove();
    } else {
        $('form').append(`<p>Error: You must select an even number of players. If you have an odd number of players, you can add a placeholder and have them lose the first round.<p>`)
    }
}

tournament.newRound = () => {
    // add a new round to html
    tournament.round++
    $('.matchups').append(`<div><h3>Round ${tournament.round}</h3></div>
    <div class="round${tournament.round} round"></div>`);
    // console.log('added round');

    let match = 0;

    for (let i = 0; i < tournament.players.length; i += 2) {
        match = match + 1

        $(`.round${tournament.round}`).append(`
            <div class="round${tournament.round}Match${match} match">
                <div class="pair">
                    <label for="${tournament.players[i]}">${tournament.players[i]}</label>
                    <input type="radio" name="round${tournament.round}Match${match}" id="${tournament.players[i]}"
                    value="${tournament.players[i]}">
                    
                    <label for="${tournament.players[i + 1]}">${tournament.players[i + 1]}</label>
                    <input type="radio" name="round${tournament.round}Match${match}" id="${tournament.players[i + 1]}"
                    value="${tournament.players[i + 1]}">
                </div>
            </div>
       `);
    }

    $('.matchups').append(`<button class="winnerRound${tournament.round}">Confirm Winners</button>`);

    tournament.roundWinner();

}


tournament.roundWinner = () => {
    $(`.winnerRound${tournament.round}`).on('click', function (e) {
        e.preventDefault(e);

        $(`.round${tournament.round}`).addClass('completed');

        if (tournament.players.length > 2) {
            // tracking which match is being evaluated
            let match = 0;
            let eliminatedArray = [];
    
            for (let i = 0; i < tournament.players.length; i += 2) {
                match = match + 1;
    
                // get name of the loser and add a value of eliminated to their object in the namespace object
                let elim = $(`input[name=round${tournament.round}Match${match}]:not(:checked)`);
                let elimValue = elim[0].value;
                eliminatedArray.push(elimValue);
            }
            
            //loops through eliminated array and pull those people from the main one.
            eliminatedArray.forEach((loser) => {
                let elimIndex = tournament.players.indexOf(loser);
                tournament.players.splice(elimIndex, 1);
            })
    
            // start a new round with the remaining players
            tournament.newRound();
        } else if (tournament.players.length == 2) {
            let match = 1;
            let winner = $(`input[name=round${tournament.round}Match${match}]:checked`);
            let winnerName = winner[0].value;

            $('.results').append(`Congratulations, ${winnerName} is the winner!`);
        }   
    })

}
// document ready
$(function () {

    $('form').on('submit', function (e) {
        e.preventDefault();
        tournament.setup();
        tournament.newRound();
    });
});