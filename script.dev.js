// Die IDs der Gebäude und Fahrzeuge, um nachher (beim Zählen) die Namen auszugeben.

var buildingsById = {
    0: 'Feuerwache',
    1: 'Feuerwehrschule',
    2: 'Rettungswache',
    3: 'Rettungsschule',
    4: 'Krankenhaus',
    5: 'Rettungshubschrauber-Station',
    6: 'Polizeiwache',
    7: 'Leitstelle',
    8: 'Polizeischule',
    9: 'THW',
    10: 'THW Schule',
    11: 'Bereitschaftspolizei'
};

var carsById = {
    0: 'LF 20',
    1: 'LF 10',
    2: 'DLK 23',
    3: 'ELW 1',
    4: 'RW',
    5: 'GW-A',
    6: 'LF 8/6',
    7: 'LF 20/16',
    8: 'LF 10/6',
    9: 'LF 16-TS',
    10: 'GW-Öl',
    11: 'GW-L2-Wasser',
    12: 'GW-Messtechnik',
    13: 'SW 1000',
    14: 'SW 2000',
    15: 'SW 2000-Tr',
    16: 'SW KatS',
    17: 'TLF 2000',
    18: 'TLF 3000',
    19: 'TLF 8/8',
    20: 'TLF 8/18',
    21: 'TLF 16/24-Tr',
    22: 'TLF 16/25',
    23: 'TLF 16/45',
    24: 'TLF 20/40',
    25: 'TLF 20/40-SL',
    26: 'TLF 16',
    27: 'GW-Gefahrgut',
    28: 'RTW',
    29: 'NEF',
    30: 'HLF 20',
    31: 'RTH',
    32: 'FuStW',
    33: 'GW-Höhenrettung',
    34: 'ELW 2',
    35: 'leBefKw',
    36: 'MTW',
    37: 'TSF-W',
    38: 'KTW',
    39: 'GKW',
    40: 'MTW-TZ',
    41: 'MzKW',
    42: 'LKW K9',
    43: 'BRmG R',
    44: 'Anh. DLE',
    45: 'MLW 5',
    46: 'WLF',
    47: 'AB-Rüst',
    48: 'AB-Atemschutz',
    49: 'AB-Öl',
    50: 'GruKw',
    51: 'FüKw',
    52: 'GefKw'
};

jQuery = $;

// Arrays, um nachher die (verfügbaren) Fahrzeuge und Wachen zu zählen
var buildingAmount = [], carAmount = [], carAvailableAmount = [];

$('.aao').bind('click', function () {
        $(this).css('border', '2px solid black');
    }
);
// Fallunterscheidung für die verschiedenen Seiten
if (window.location.pathname == '/') {
    // Startseite
    tabsForMissions();
    fayeEvent();
    changeTabTitleByCall();
    showStationSearch();
    showChatSearch();

    // Faye dazu anweisen, die Funktion fayeEvent aufzurufen
    faye.subscribe('/private-user' + user_id + 'de', function () {
        fayeEvent();
    });
    if (alliance_id != undefined) {
        faye.subscribe('/private-alliance-' + alliance_id + 'de', function () {
            fayeEvent();
        });
    }

} else if (window.location.pathname.match(/missions\//)) {
    // Einsätze
    showCarTypesInsteadOfStation();
    useEasyHotkeys()
}

// Funktion wird immer angerufen, wenn ein Event von faye komm (bspw. Statuswechsel, neuer Einsatz etc.)
function fayeEvent() {
    prepareBuildingAndCarCounter();
    showBuildingSearch();
    showCarSearch();
    showBuildingAmount();
    showCarAmount();
    changeTabTitleByCall();
    showMissionCounterInTab();
    countPatients();
}

// zwei Divs für die Fahrzeuge und Wachen erstellen
function prepareBuildingAndCarCounter() {
    var scriptAmountDiv = $('#scriptAmount');
    if (scriptAmountDiv.length == 0) {
        $('.container-fluid:eq(0) > .row:eq(2)').after('<div class="row" id="scriptAmount"></div>');
        scriptAmountDiv = $('#scriptAmount');
    }
    scriptAmountDiv
        .empty()
        .append('<div class="col-sm-4 overview_outer"><div class="sidebar-nav"><div class="panel panel-default"><div class="panel-heading">Wachen und Gebäude</div><div class="panel-body" id="scriptBuildingAmount"></div></div></div></div>')
        .append('<div class="col-sm-4 overview_outer"><div class="sidebar-nav"><div class="panel panel-default"><div class="panel-heading">Fahrzeuge</div><div class="panel-body" id="scriptCarAmount"></div></div></div></div>');
}

// Gebäude zählen und in Array speichern
function countBuildings() {
    // alle Zählerstände der Gebäude auf 0 setzen
    for (var i = 0; i <= 12; i++) {
        buildingAmount[i] = 0;
    }

    // für jedes Gebäude, was in der Liste gefunden wird, +1 im Array buildingAmount rechnen
    $('#building_list').find('.building_list_li').each(function (index, element) {
        buildingAmount[$(element).attr('building_type_id')]++;
    });
    return buildingAmount;
}

// alle Fahrzeuge zählen und in Array speichern
function countCars() {
    // alle Zählerstände der Fahrzeuge auf 0 setzen
    for (var i = 0; i <= 53; i++) {
        carAmount[i] = 0;
    }

    // für jedes Fahrzeug, was in der Liste gefunden wird, +1 im Array carAmount rechnen
    $('.building_list_vehicle_element').each(function (index, element) {
        carAmount[$(element).find('a').attr('vehicle_type_id')]++;
    });
    return carAmount;
}

// alle verfügbaren Fahrzeuge zählen und in Array speichern
function countAvailableCars() {
    // alle Zählerstände der Fahrzeuge auf 0 setzen
    for (var i = 0; i <= 53; i++) {
        carAvailableAmount[i] = 0;
    }

    // für jedes Fahrzeug, was in der Liste gefunden wird und Status 1 oder 2 ist, +1 im Array carAvailableAmount rechnen
    $('.building_list_vehicle_element').each(function (index, element) {
        if ($(element).find('span').html() == "2") {
            carAvailableAmount[$(element).find('a').attr('vehicle_type_id')]++;
        }
    });
    return carAvailableAmount;
}

// gezählte Gebäude ausgeben
function showBuildingAmount() {
    var buildings = countBuildings();

    $('#scriptBuildingAmount').append('<table class="table table-bordered table-condensed table-striped table-hover"><thead><tr><th>Gebäude</th><th>Anzahl</th></tr></thead><tbody id="scriptBuildingAmountTable"></tbody></table>');

    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i] > 0) {
            $('#scriptBuildingAmountTable').append('<tr><td>' + buildingsById[i] + '</td><td>' + buildings[i] + '</td></tr>');
        }
    }
}

// gezählte Fahrzeuge ausgeben
function showCarAmount() {
    var cars = countCars();
    var carsAva = countAvailableCars();

    $('#scriptCarAmount').append('<table class="table table-bordered table-condensed table-striped table-hover"><thead><tr><th>Fahrzeug</th><th>Anzahl</th><th>Verfügbar</th></tr></thead><tbody id="scriptCarAmountTable"></tbody></table>');

    for (var i = 0; i < cars.length; i++) {
        if (cars[i] > 0) {
            $('#scriptCarAmountTable').append('<tr><td>' + carsById[i] + '</td><td>' + cars[i] + '</td><td>' + carsAva[i] + '</td></tr>');
        }
    }
}

// Suchleiste für die Gebäudeübersicht erstellen
function showBuildingSearch() {
    $('#scriptBuildingAmount').append('<input id="scriptBuildingSearch" class="form-control" placeholder="Suchen" type="text"><br /><br />');

    $('#scriptBuildingSearch').bind('keyup', function () {
        var searchWord = new RegExp($('#scriptBuildingSearch').val().toLowerCase());

        $('#scriptBuildingAmountTable').find('tr').each(function (index, element) {
            // zunächst die Zeile wieder sichtbar machen
            $(element).show();

            // nun die Zelle prüfen, ob der Suchbegriff vorhanden ist
            if (!$(element).find('td:eq(0)').html().toLowerCase().match(searchWord)) {
                $(element).hide();
            }
        });
    });
}

// Suchleiste für die Fahrzeugübersicht erstellen
function showCarSearch() {
    $('#scriptCarAmount').append('<input id="scriptCarSearch" class="form-control" placeholder="Suchen" type="text"><br /><br />');

    $('#scriptCarSearch').bind('keyup', function () {
        var searchWord = new RegExp($('#scriptCarSearch').val().toLowerCase());

        $('#scriptCarAmountTable').find('tr').each(function (index, element) {
            // zunächst die Zeile wieder sichtbar machen
            $(element).show();

            // nun die Zelle prüfen, ob der Suchbegriff vorhanden ist
            if (!$(element).find('td:eq(0)').html().toLowerCase().match(searchWord)) {
                $(element).hide();
            }
        });
    });
}

// Tabs bei Einsatzliste
function tabsForMissions() {
    // Bisherige Button ausblenden
    var missionDiv = $('#missions');
    missionDiv.find('.btn-group').hide();

    // Tabs erstellen
    var missionListDiv = $('#mission_list');
    missionListDiv.before('<div id="scriptMissionTab"></div>');
    var scriptMissionTab = $('#scriptMissionTab');

    missionDiv.find('.panel-heading:eq(0)').append('<div id="scriptMissionMenu"><ul class="nav nav-pills small" style="padding-left: 0"><li class="active"><a href="#scriptEmergencies" data-toggle="tab">NF (<span id="scriptEmergencyCounter"></span>)</a></li><li><a href="#scriptTransports" data-toggle="tab">KTP (<span id="scriptTransportCounter"></span>)</a></li><li><a href="#scriptAlliances" data-toggle="tab">VE (<span id="scriptAllianceCounter"></span>)</a></li></ul></div>')
    scriptMissionTab
        //.append('<div id="scriptMissionMenu"><br /><ul class="nav nav-pills"><li class="active"><a href="#scriptEmergencies" data-toggle="tab">NF (<span id="scriptEmergencyCounter"></span>)</a></li><li><a href="#scriptTransports" data-toggle="tab">KTP (<span id="scriptTransportCounter"></span>)</a></li><li><a href="#scriptAlliances" data-toggle="tab">VE (<span id="scriptAllianceCounter"></span>)</a></li></ul><br /></div>')
        .append('<div class="tab-content" id="scriptTabContent"></div>');

    var missionList = missionListDiv.html();
    missionListDiv.remove();

    var scriptTabContent = $('#scriptTabContent');
    scriptTabContent.append('<div class="tab-pane active" id="scriptEmergencies"><ul id="mission_list" style="padding-left: 0">' + missionList + '</ul></div>');

    var missionListKrankentransporteDiv = $('#mission_list_krankentransporte');
    var missionListKrankentransporte = missionListKrankentransporteDiv.html();
    missionListKrankentransporteDiv.remove();
    scriptTabContent.append('<div class="tab-pane" id="scriptTransports"><ul id="mission_list_krankentransporte">' + missionListKrankentransporte + '</ul></div>');

    var missionListAllianceDiv = $('#mission_list_alliance');
    var missionListAlliance = missionListAllianceDiv.html();
    missionListAllianceDiv.remove();
    scriptTabContent.append('<div class="tab-pane" id="scriptAlliances"><ul id="mission_list_alliance">' + missionListAlliance + '</ul></div>');
}

// Suchleiste für Wachenliste
function showStationSearch() {
    $('#buildings').find('.panel-heading').append('<input id="scriptStationSearch" class="form-control" placeholder="Suchen" type="text">');

    $('#scriptStationSearch').bind('keyup', function () {
        var searchWord = new RegExp($('#scriptStationSearch').val().toLowerCase());

        $('#building_list').find('.map_position_mover').each(function (index, element) {
            // zunächst die Wache wieder sichtbar machen
            $(element).parent().parent().show();

            // nun den Namen prüfen, ob der Suchbegriff vorhanden ist
            if (!$(element).html().toLowerCase().match(searchWord)) {
                $(element).parent().parent().hide();
            }
        });
    });
}

// Suchleiste für Verbandschat
function showChatSearch() {
    $('#chat_outer').find('.panel-heading').append('<input id="scriptChatSearch" class="form-control" placeholder="Suchen" type="text">');

    $('#scriptChatSearch').bind('keyup', function () {
        var searchWord = new RegExp($('#scriptChatSearch').val().toLowerCase());

        $('#mission_chat_messages').find('li').each(function (index, element) {
            // zunächst die Wache wieder sichtbar machen
            $(element).show();

            // nun den Namen prüfen, ob der Suchbegriff vorhanden ist
            if (!$(element).html().toLowerCase().match(searchWord)) {
                $(element).hide();
            }
        });
    });
}

// Falls es Sprechwünsche gibt, soll der Titel des Tabs geändert werden
function changeTabTitleByCall() {
    if ($('#radio_messages_important').children().length > 0) {
        document.title = "Sprechwunsch!";
    } else {
        document.title = "LEITSTELLENSPIEL.DE - baue deine eigene Leitstelle, in deiner Stadt!";
    }
}

// Einsatzzahlen in den Einsatztabs anzeigen
function showMissionCounterInTab() {
    var missions = $('#missions');
    $('#scriptEmergencyCounter').html(missions.find('.btn-group').find('a:eq(0)').html().replace(')', '').split('(')[1]);
    $('#scriptTransportCounter').html(missions.find('.btn-group').find('a:eq(1)').html().replace(')', '').split('(')[1]);
    $('#scriptAllianceCounter').html(missions.find('.btn-group').find('a:eq(2)').html().replace(')', '').split('(')[1]);
}

// Patienten zählen und anzeigen
function countPatients() {

    var missionList = $('#mission_list');
    var patientsAmount = missionList.find('.patient_progress:visible').length; // Patientenanzahl
    var patientsTreatment = missionList.find('.patient_progress.active:visible').length; // Patienten in Behandlung
    var patientsReady = missionList.find('.patient_progress').find('.bar-success').length; // Patienten transportbereit
    $('#scriptPatientsCounter').remove();
    $('#scriptMissionMenu').append('<small id="scriptPatientsCounter">Pat.: ' + patientsAmount + ' insg., ' + patientsTreatment + ' in Behandlung, ' + patientsReady + ' transpf.</small>');
}

// Fahrzeugtypen statt Name bei Klick auf Button
function showCarTypesInsteadOfStation() {
    // Button neben dem ersten "Alarmieren"-Button erstellen
    $('#missionH1').after('<button type="button" id="scriptShowCarTypes" class="btn btn-info btn-mini">Fzg.-Typen anzeigen</button>');
    $('#scriptShowCarTypes').bind('click', function () {
            $('td[vehicle_type_id]').each(function (ind, tdEl) {
                    $(tdEl).parent().find('td:eq(2)').html(carsById[$(tdEl).attr('vehicle_type_id')]);
                }
            );
            $('a[vehicle_type_id]').each(function (ind, aEl) {
                    $(aEl).html(carsById[$(aEl).attr('vehicle_type_id')]);
                }
            );
        }
    )
}

// Hotkeys ohne Tastenkombination
function useEasyHotkeys() {
    $(document).on('keydown', function(e) {
        var keynum;
        if(window.event) {
            keynum = e.keyCode;
        } else {
            keynum = e.which
        }

        var hotkey = String.fromCharCode(keynum).trim();

        if($('#mission_reply_content').is(':focus')) {
            return;
        }
        if(hotkey != " " && hotkey != "") {
            $('[accesskey='+ hotkey +']').click();
        }
    });
}
