/**
 * Created by jfowler on 1/8/14.
 */
function getName(){
    if(ClientSaveUtility.hasSavedNames()){
        selectSavedName();
    }
    else{
        getNameFromUser();
    }
}

function selectSavedName(){
    addSavedNamesToDialog();

    $("#saved-name-dialog").dialog({
        resizable: false,
        modal: true,
        width: 500,
        buttons: {
            "New Game": function () {
                $(this).dialog("close");
                getNameFromUser();
            }
        }
    });
}

function addSavedNamesToDialog(){
    var savedNames = ClientSaveUtility.getSavedNames();

    $nameList = $('<ul />', {'id': 'saved-name-list'});
    for(var i = 0; i < savedNames.length; i++){
        $('<li />', {'text': savedNames[i]}).on('click', function(){
            setUserName($(this).text());
            $("#saved-name-dialog").dialog('close');
            window.location.replace("snake.html");
        }).appendTo($nameList);
    }

    $nameList.appendTo('#saved-names');
}

function getNameFromUser(){
    $("#name-dialog").dialog({
        resizable: false,
        modal: true,
        buttons: {
            "Start": function () {
                var newName = $('#name-input').val();
                setUserName(newName);
                ClientSaveUtility.addPlayer(newName);
                $(this).dialog("close");
                window.location.replace("snake.html");
            }
        }
    });
}

function setUserName(name){
    ClientSaveUtility.setPlayerName(name);
}