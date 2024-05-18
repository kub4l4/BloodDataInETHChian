const { compiledContract } = require('../compile');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const clearTextPassword = "PasswordForTests";
let accounts;
let deployedRecordContract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    deployedRecordContract = await new web3.eth.Contract(compiledContract.abi).deploy({
        data: compiledContract.evm.bytecode.object,
        arguments: [clearTextPassword]
    }).send({ from: accounts[0], gas: '1000000' });
});

describe('RecordMap', () => {
    it('deploys', () => {
        assert.ok(deployedRecordContract.options.address);
        console.log(deployedRecordContract.options.address);
    });

    it('changes RecordMaps', async () => {
        await deployedRecordContract.methods.setRecordMaps(clearTextPassword, "New patient information map", "New Blood Information Map").send({
            from: accounts[0],
            gas: 5000000
        });
        const updatedPatientInformationMap = await deployedRecordContract.methods.patientInformationMap().call();
        const updatedBloodInformationMap = await deployedRecordContract.methods.bloodInformationMap().call();
        assert.equal("New patient information map", updatedPatientInformationMap);
        assert.equal("New Blood Information Map", updatedBloodInformationMap);
    });

    it("can't change RecordMap with wrong password", async () => {
        try {
            await deployedRecordContract.methods.setRecordMaps("wrong password!", "New patient information map", "New Blood Information Map").send({
                from: accounts[0],
                gas: 5000000
            });
        } catch (error) {
            assert(error);
        }
        const updatedPatientInformationMap = await deployedRecordContract.methods.patientInformationMap().call();
        const updatedBloodInformationMap = await deployedRecordContract.methods.bloodInformationMap().call();
        assert.notEqual("New patient information map", updatedPatientInformationMap);
        assert.notEqual("New Blood Information Map", updatedBloodInformationMap);
    });
});
