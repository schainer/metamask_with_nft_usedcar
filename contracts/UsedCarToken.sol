pragma solidity ^0.6.2;

import './ERC721.sol';

contract UsedCarToken is ERC721 {
    mapping(uint => bool) _uniqueVIN;
    constructor() ERC721("UsedCar", "UCAR") public {}

    function mint(uint _vin) public {
        require(!_uniqueVIN[_vin]);
        _uniqueVIN[_vin] = true;
        _mint(msg.sender, _vin);
    }

    function isOwnerOf(uint _vin) public view returns(bool) {
        if(ownerOf(_vin) == address(msg.sender)) {
            return true;
        }
        return false;
    }

    function isExist(uint _vin) public view returns(bool) {
        return _uniqueVIN[_vin];
    }

    function purchase(address _from, address _to, uint _vin) public {
        _transfer(_from, _to, _vin);
    }
}