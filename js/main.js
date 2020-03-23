// Set the default host as my test instance until Mozilla updates their instance with the PR ~~Mozilla's own Corsica server~~
// var host = "https://corsica.mozilla.io/";
var host = "https://tomfairey-corsica.herokuapp.com/";

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

// Get all subscriptions of the clients
function getSubscriptions(callback, screen) {
    $.ajax({
        type: "POST",
        url: host+"api/tags.getSubscriptions",
        contentType: "application/json",
        success: function(data) {
            callback(data, screen);
        },
        dataType: "JSON"
    });
}

// Get all available tags (~~Pending~~ Approved PR on mozilla/corsica from tomfairey/corsica)
function getTags(callback) {
    $.ajax({
        type: "POST",
        url: host+"api/tags.getAll",
        contentType: "application/json",
        success: function(data) {
            callback(data);
        },
        dataType: "JSON"
    });
}

// Get the content of a specific tag to display to the user on selection of said tag
function getTagContent(callback, tagName){
    $.ajax({
        type: "POST",
        url: host+"api/tags.getAll",
        contentType: "application/json",
        success: function(data) {
            data.tags.forEach(function(tag) {
                if(tag.name === tagName) {
                    callback(tag);
                };
            });
        },
        dataType: "JSON"
    });
}

// Parse all tags on the selected client so the user may subscribe clients to available tags
function parseSubscribeTags(data) {
    $(".subscribeTags").html("");
    data.tags.forEach(function(data) {
        if(Object.keys(data).length > 0 && data.constructor === Object) {
            $(".subscribeTags").append("<option>"+data.name+"</option>");
        }
    });
    getTagContent(parseTagContent, $(".subscribeTags").val());
}

// Parse all tags currently subscribed to by the selected client so the user may unsubscribe the client from said tag
function parseUnsubscribeTags(data, screen) {
    $(".unsubscribeTags").html("");
    console.log("data.subscriptions[screen]", data.subscriptions[screen]);
    data.subscriptions[screen].forEach(function(data) {
        $(".unsubscribeTags").append("<option>"+data+"</option>");
    })
}

// Parse the content a specific tag holds, remove XSS possibility and append the string to the 'textarea' element
function parseTagContent(data) {
    $(".subscribeTagContent").html("");
    console.log("data", data);
    var lt = /</g, 
    gt = />/g, 
    ap = /'/g, 
    ic = /"/g;
    data.commands.forEach(function(command) {
        command = command.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
        $(".subscribeTagContent").append(command + "\n\n");
    });
}

// A single function to fetch and parse clients
function displayClients() {
    getCensus(parseCensus);
}