const { contracts_build_directory } = require('../truffle-config');
const { assert } = require('chai');

const UsedCar = artifacts.require('./UsedCarToken.sol')
require('chai').use(require('chai-as-promised')).should();

contract('UsedCar', (accounts) => {
    let contract
    before(async() => {
        contract = await UsedCar.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = contract.address
            console.log(address)
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
        })
    })

    describe('minting', async() => {
        const vin = 123456
        it('minted a new token', async() => {
            const result = await contract.mint(vin)
            const totalSupply = await contract.totalSupply()
            const event = result.logs[0].args
            console.log(`number of Token: ${totalSupply}`)
            assert.equal(event.tokenId.toNumber(), vin, 'Token id is correct')
            assert.equal(event.to, accounts[0], 'to is correct')
        })
        it('create same token', async() => {
            await contract.mint(vin).should.be.rejected
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 1, 'total supply should still be 1')
        })
    })

    describe('ownership', async() => {
        it('check ownership of the token', async() => {
            const vin = 123456
            var result = await contract.isOwnerOf(vin)
            assert.equal(result, true, 'ownership is correct')
            result = await contract.isOwnerOf.call(vin, {from: accounts[1]})
            assert.equal(result, false, 'ownership is correct')
        })
    })
})