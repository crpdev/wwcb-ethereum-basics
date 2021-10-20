App = {

    web3Provider: null,
    contracts: {},
    events: [],
    eventVotes: [],
    eventInfo: {},

    init: function(){
        return App.initWeb3();
    },

    initWeb3: function(){

        // if (typeof web3 !== 'undefined'){   
        //     // Use MetaMask's provider
        //     App.web3Provider = web3.currentProvider;
        //     web3 = new Web3(web3.currentProvider);
        //     App.setStatus("MetaMask detected");
        // } else {
        //     alert("Error: Please install MetaMask and refresh the page!");
        //     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        //     web3 = new Web3(App.web3Provider);
        //     return null;
        // }

        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(App.web3Provider);

        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
              alert("There was an error fetching your account, please try again later.");
              return;
            }
            account = accs[0];
            if (!account) {
              App.setStatus("Please login to MetaMask");
              alert("Could not fetch your account. Make sure you are logged in to MetaMask, then refresh the page.");
              return;
            }
            return App.initContract();
          });
    },

    initContract: function(){
        $.getJSON('EventVoting.json', function(EventVotingArtifact) {
            App.contracts.EventVoting = TruffleContract(EventVotingArtifact);
            App.contracts.EventVoting.setProvider(App.web3Provider);
            return App.getContractProperties();
        });
    },

    getContractProperties: function() {
        const self = this;
        let meta;
        let totalEvents = 0;
        App.contracts.EventVoting.deployed().then(function(instance) {
            meta = instance;
            return meta.getContractDetails.call({from: account});
        }).then(function(value){
            const networkAddress = App.contracts.EventVoting.address;
            document.getElementById("contractAddress").innerHTML = networkAddress;
            const by = value[0];
            const registeredEvents = value[1];
            App.eventInfo.totalEvents = registeredEvents.length;
            for (var i = 0; i < App.eventInfo.totalEvents; i++) {
                App.getAllEvents(i);
            }         
            document.getElementById("contractOwner").innerHTML = by;
            document.getElementById("events").innerHTML = App.eventInfo.totalEvents;
        }).catch(function(e) {
            console.log(e);
        });
        return null;
    },

    getAllEventsAndVotes: function() {
        const self = this;
        let meta;
        App.contracts.EventVoting.deployed().then(function(instance) {
            meta = instance;
            console.log("Total events: " + totalEvents);
            for (var i = 0; i < totalEvents; i++) {
                return meta.votesReceivedPerEvent.call('Ethereum Basics', {from: account});
            }           
        }).then(function(value){
            console.log("Adding " + value + " to events array");
            App.events.push(value);
            App.getAllEventVotes(value);
        }).catch(function(e) {
            console.log(e);
            self.setStatus("");
        });
        return null;
    },

    getAllEvents: function(eventIndex) {
        const self = this;
        let meta;
            App.contracts.EventVoting.deployed().then(function(instance) {
                meta = instance;
                    return meta.eventList.call(eventIndex, {from: account});
            }).then(function(value){
                console.log("Adding " + value + " to events array");
                App.events.push(value);
                App.getAllEventVotes(value);
            }).catch(function(e) {
                console.log(e);
                self.setStatus("");
            });
        return App.getAllEventVotes();
    },

    getAllEventVotes: function(eventName) {
        const self = this;
        let meta;
        App.contracts.EventVoting.deployed().then(function(instance) {
            meta = instance;
            return meta.totalVotesForEvent.call(eventName, {from: account});
        }).then(function(value){         
            console.log("Adding vote " + value + " to eventVotes array for event " + eventName);    
            App.eventVotes.push(value);
            App.generateTable();
        }).catch(function(e) {
            console.log(e);
        });
        return null;
    },

    displayMyAccountInfo: function(){
        const self = this;
        web3.eth.getAccounts(function(err, account) {
            if(err === null) {
                App.account = account;
                document.getElementById("myAddress").innerHTML = account;
                // web3.eth.getBalance(account[0], function(err, balance){
                //     if (err === null) {
                //         if(balance == 0){
                //             alert("Your account has zero balance. You must transfer some Ether to your Metamask account");
                //             App.setStatus("Please buy more Ether");
                //             return;
                //         } else {
                //             document.getElementById("myBalance").innerHTML = web3.fromWei(balance, "ether").toNumber() + " Ether";
                //             return App.checkUserRegistration();
                //         }
                //     } else {
                //         console.log(err);
                //     }
                // });
            }
        });
        return null;
    },

    generateTable: function(row, eventName, voteCount) {
        console.log("Rendering table...");
 
        //Create a HTML Table element.
        var table = document.createElement("TABLE");
        table.border = "1";
        
        //Add the header row.
        var row = table.insertRow(-1);
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = "Event Name";
        row.appendChild(headerCell);
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = "Votes Received";
        row.appendChild(headerCell);
        //Add the data rows.
        for (var i = 0; i < App.events.length; i++) {
            console.log("Rendering table rows")
            row = table.insertRow(-1);
            for (var j = 1; j < App.events.length; j++) {
                console.log("Adding event: " + App.events[i]);
                var cell = row.insertCell(-1);
                cell.innerHTML = App.events[i];
            }
            for (var j = 1; j < App.eventVotes.length; j++) {
                console.log("Adding vote: " + App.eventVotes[j]);
                var cell = row.insertCell(-1);
                cell.innerHTML = App.eventVotes[i];
            }
        }
 
        var dvTable = document.getElementById("dvTable");
        dvTable.innerHTML = "";
        dvTable.appendChild(table);
        return null;
    }

};

$(document).ready(function() {
    App.init();
});