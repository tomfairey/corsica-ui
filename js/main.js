// Set the default host as Mozilla's own Corsica server
var host = "http://corsica.mozilla.io/";

// Allow changing of the host and updating of the UI after host change
function setHost(newHost) {
    host = newHost;
    $(".host").html(host);
}

// Allow commands to be issued via the Corsica API
function issueCommand(command) {
    // All commands are issued through a POST request
    return $.ajax({
        type: "POST",
        url: host+"api/command",
        contentType: "application/json",
        data: JSON.stringify({"raw": command}),
        success: function(data) {
            return data;
        },
        dataType: "JSON"
    });
}

// Allow for the fecthing of all currently connected clients from the Corsica API
function getCensus(callback) {
    // The data is requested via a POST request
    $.ajax({
        type: "POST",
        url: host+"api/census.clients",
        contentType: "application/json",
        success: function(data) {
            callback(data);
        },
        dataType: "JSON"
    });
}

// Allow for parsing of the client data from the API to be shown on the UI
function parseCensus(data) {
    $(".clients").html("");
    data.clients.forEach(function(data) {
        $(".clients").append("<option>"+data+"</option>");
    });
}

// A single function to fetch and parse clients
function displayClients() {
    getCensus(parseCensus);
}