const EventVoting = artifacts.require('./EventVoting.sol');

module.exports = function(deployer){
    deployer.deploy(EventVoting);
}