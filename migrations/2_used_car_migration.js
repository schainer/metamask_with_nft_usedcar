const UsedCar = artifacts.require("./UsedCarToken");

module.exports = function(deployer) {
  deployer.deploy(UsedCar);
};
