/**
 * A singleton for saving and retrieving players and player data on the client-side.
 * In order to allow static-style access to public methods while hiding internal
 * methods, it implements Yahoo's Module Pattern. The goal is to hide the existence of
 * the PlayerData object and other implementation details from the calling classes.
 * Ref: http://yuiblog.com/blog/2007/06/12/module-pattern/
 * Ref: http://stackoverflow.com/questions/3218912/private-static-functions-in-javascript
 */

var ClientSaveUtility = (function () {
    //"private" methods:
    var getPlayerData = function(playerName){
        var playerDataString = localStorage.getItem(playerName);

        if(playerDataString === null){
            console.log('Could not find player with name "' + playerName + '".');
            return;
        }

        return JSON.parse(playerDataString);
    };

    var setPlayerData = function(playerName, playerData){
        localStorage.setItem(playerName, JSON.stringify(playerData));
    };

    return {
        // "public" methods:
        hasSavedNames: function(){
            if(localStorage.getItem('names') === null){
                return false;
            }

            return true;
        },

        getSavedNames: function(){
            if(localStorage.getItem('names') === null){
                return [];
            }

            return JSON.parse(localStorage.getItem('names'));
        },

        addPlayer: function(playerName){
            var nameArray;

            if(localStorage.getItem('names') === null){
                nameArray = [];
            }
            else{
                nameArray = JSON.parse(localStorage.getItem('names'));
            }

            if($.inArray(playerName, nameArray) === -1){
                nameArray.push(playerName);
                localStorage.setItem('names', JSON.stringify(nameArray));

                playerData = {personalBest: 0, totalPoints: 0};
                localStorage.setItem(playerName, JSON.stringify(playerData));
            }
        },

        getPersonalBest: function(playerName){
            var playerData = getPlayerData(playerName);

            if(playerData === null){
                console.log('Could not find personal best score for player "' + playerName + '". Returning zero.');
                return 0;
            }

            return playerData.personalBest;
        },

        setPersonalBest: function(playerName, score){
            var playerData = getPlayerData(playerName);

            if(playerData === null){
                console.log('Cannot set personal best for player "' + playerName + '".');
                return;
            }

            if(score > playerData.personalBest){
                playerData.personalBest = score;
            }

            setPlayerData(playerName, playerData);
        },

        addPointsToTotal: function(playerName, score){
            var playerData = getPlayerData(playerName);

            if(playerData === null){
                console.log('Cannot add points for player "' + playerName + '".');
                return;
            }

            playerData.totalPoints += score;

            setPlayerData(playerName, playerData);
        }
    };
})();
