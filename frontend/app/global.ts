/** Global variables **/

export const prodeUserKey = 'prodeUser';
export const monthLabels = {0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril', 4: 'Mayo', 5: 'Junio',
    6: 'Julio', 7: 'Agosto', 8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre', 11: 'Diciembre'};
// Timezone
export const TimeZone = 'America/Argentina/Cordoba';
export const getDateTime = (datetime): string => {
    let d = new Date(datetime), hours = String(d.getHours()),
        mins = String(d.getMinutes()), dateString;

    hours = (hours.length > 1)? hours : '0'+hours;
    mins = (mins.length > 1)? mins : '0'+mins;

    dateString = d.getDate() + ' de ' + monthLabels[d.getMonth()] + ' - '
        + hours + ':' + mins + ' Hs.';

    return dateString;
};

// Get prediction points
export const getPredictionPoints = (fantasyTournament, game, prediction): number => {
    let points = 0;
    if (fantasyTournament && game && prediction && prediction.processed) {
        if (prediction.hit) {
            points += fantasyTournament.points_per_game;
        }
        if (fantasyTournament.match_exact && prediction.hit_exact) {
            points += fantasyTournament.points_per_exact;
        }
    }

    return points;
};