const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractToCompileName = "recordmap.sol";
const contractPath = path.resolve(__dirname, 'contracts', contractToCompileName);

let contractSource;
try {
    contractSource = fs.readFileSync(contractPath, 'utf-8');
} catch (err) {
    console.error("Error reading contract file:", err);
    process.exit(1);
}

const input = {
    language: 'Solidity',
    sources: {[contractToCompileName]: {content: contractSource}},
    settings: {outputSelection: {'*': {'*': ['*']}}}
};

let compiledContracts;
try {
    compiledContracts = JSON.parse(solc.compile(JSON.stringify(input)));
} catch (err) {
    console.error("Error compiling contract:", err);
    process.exit(1);
}

if (compiledContracts.errors) {
    compiledContracts.errors.forEach(err => console.error(err.formattedMessage));
    process.exit(1);
}

const compiledContract = compiledContracts.contracts[contractToCompileName]["RecordMap"];
console.log(compiledContract);
module.exports = { compiledContract };
