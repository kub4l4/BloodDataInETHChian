// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract RecordMap
{
    bytes32 private passwordHash;
    string public patientInformationMap;
    string public bloodInformationMap;

    event RecordMapsUpdated(string newPatientInformationMap, string newBloodInformationMap);

    constructor(string memory passwordClearText)
    {
        passwordHash = keccak256(abi.encodePacked(passwordClearText));
    }

    function setRecordMaps(string memory passwordClearText, string memory newPatientInformationMap, string memory newBloodInformationMap) public
    {
        bytes32 givenPasswordHash = keccak256(abi.encodePacked(passwordClearText));
        if(passwordHash == givenPasswordHash)
        {
            patientInformationMap = newPatientInformationMap;
            bloodInformationMap = newBloodInformationMap;
        }
    }
}
