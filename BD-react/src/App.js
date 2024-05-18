import './css/AppStyle.css';
import React, {useState} from 'react';
import Web3 from 'web3';
import crypto from 'crypto-js';
import NewContractScreen from "./modules/NewContract";
import ReadContract from "./modules/ReadContract";
import {Button, createTheme, MuiThemeProvider} from "@material-ui/core";
import ShowUpdate from "./modules/ShowUpdate";
import ShowData from "./modules/ShowData";

window.ethereum.request({method: "eth_requestAccounts"});
const web3 = new Web3(window.ethereum);

const theme = createTheme({
    typography: {
        fontFamily: ['Roboto', 'sans-serif'].join(',')
    },
    palette: {
        primary: {main: '#420088'}, // Purple and green play nicely together.
        secondary: {main: '#124800'} // This is just green.A700 as hex.
    }

});

function App() {
    const [passwordClearText, setPasswordClearText] = useState('');
    const [passwordClearTextPatient, setPasswordClearTextPatient] = useState('');
    const [passwordClearTextParameters, setPasswordClearTextParameters] = useState('');

    const [deployedContract, setDeployedContract] = useState(null);
    const [deployedAddress, setDeployedAddress] = useState('');
    const [contractAddress, setContractAddress] = useState('');

    const [showData, setShowData] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [mode, setMode] = useState('create'); // state for selecting mode
    const [readOption, setReadOption] = useState(''); // state for selecting read option
    const [patientInformationMap, setPatientInformationMap] = useState({
        "Name and Surname": '', "Birth date": '', "Gender": '', "Age": '', "Blood Group": '',
    });
    const [bloodInformationMap, setBloodInformationMap] = useState([]);
    const [newBloodParameter, setNewBloodParameter] = useState({name: '', result: '', unit: ''});
    const [patientPasswordError, setPatientPasswordError] = useState(false);
    const [bloodPasswordError, setBloodPasswordError] = useState(false);
    const [contractPasswordError, setContractPasswordError] = useState(false);
    const [contractAddressError, setContractAddressError] = useState(false);
    const [showReadOptions, setShowReadOptions] = useState(false);

    const handlePasswordClearTextChanged = (event) => {
        setContractPasswordError(false);
        setPasswordClearText(event.target.value);
    };

    const handlePasswordClearTextBasicChanged = (event) => {
        setPatientPasswordError(false);
        setPasswordClearTextPatient(event.target.value);
    };

    const handlePasswordClearTextTailorChanged = (event) => {
        setBloodPasswordError(false);
        setPasswordClearTextParameters(event.target.value);
    };

    const handleContractAddressChanged = (event) => {
        setContractAddressError(false);
        setContractAddress(event.target.value);
    };

    const handleModeChange = (text) => {
        setMode(text);
        setShowReadOptions(false);
        setShowUpdate(false);
        setShowData(false);
        setDeployedAddress('');
        setContractAddress('');
        setPasswordClearText('');
        setPasswordClearTextPatient('');
        setPasswordClearTextParameters('');
        setPatientInformationMap({
            "Name and Surname": '', "Birth date": '', "Gender": '', "Age": '', "Blood Group": '',
        });
        setBloodInformationMap([]);
        setNewBloodParameter({name: '', result: '', unit: ''});
    };

    const handleReadOptionChange = (event) => {
        setReadOption(event.target.value);
    };

    const handlePatientInformationMapChange = (e, key) => setPatientInformationMap({
        ...patientInformationMap, [key]: e.target.value
    });
    const handleBloodInformationMapChange = (index, field, value) => {
        const updatedBloodInformationMap = [...bloodInformationMap];
        updatedBloodInformationMap[index][field] = value;
        setBloodInformationMap(updatedBloodInformationMap);
    };

    const handleNewBloodParameterChange = (field, value) => {
        setNewBloodParameter({...newBloodParameter, [field]: value});
    };

    const addBloodParameter = () => {
        setBloodInformationMap([...bloodInformationMap, newBloodParameter]);
        setNewBloodParameter({name: '', result: '', unit: ''});
    };

    const fetchCompiledContract = async () => {
        try {
            const response = await fetch('http://localhost:8000');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch compiled contract:', error);
        }
    };

    const deployContract = async () => {
        try {
            const compiledContract = await fetchCompiledContract();
            const accounts = await web3.eth.getAccounts();
            const contract = await new web3.eth.Contract(compiledContract.abi)
                .deploy({data: compiledContract.evm.bytecode.object, arguments: [passwordClearText]})
                .send({from: accounts[0], gas: '1000000'});
            setDeployedContract(contract);
            setDeployedAddress(contract.options.address);
            setShowUpdate(true);
        } catch (error) {
            console.error('Failed to deploy contract:', error);
        }
    };

    const updateRecordMaps = async () => {
        if (!deployedContract) {
            console.error('Contract is not deployed yet.');
            return;
        }
        try {
            const accounts = await web3.eth.getAccounts();
            const patientDataBasicString = JSON.stringify(patientInformationMap);
            const bloodParametersBasicString = JSON.stringify(bloodInformationMap);
            const patientRecordBasic = {
                patientData: JSON.parse(patientDataBasicString),
                bloodParameters: JSON.parse(bloodParametersBasicString)
            };
            const patientRecordBasicStringString = JSON.stringify(patientRecordBasic);
            const encryptedPatientRecordBasicStringMap = crypto.AES.encrypt(patientRecordBasicStringString, passwordClearTextPatient).toString();
            const encryptedBloodInformationMap = crypto.AES.encrypt(bloodParametersBasicString, passwordClearTextParameters).toString();
            await deployedContract.methods.setRecordMaps(passwordClearText, encryptedPatientRecordBasicStringMap, encryptedBloodInformationMap).send({
                from: accounts[0], gas: 5000000
            });
            setContractPasswordError(false);
        } catch (error) {
            setContractPasswordError(true);
            console.error('Failed to update record maps:', error);
        }
    };

    const loadRecordMaps = async () => {
        if (!deployedContract) {
            console.error('Contract is not deployed yet.');
            return;
        }
        let patientPasswordValid = true;
        let bloodPasswordValid = true;
        setShowData(false);
        try {
            if (readOption === 'patient') {
                patientPasswordValid = await loadPatientInformationMap();
            }
            if (readOption === 'blood') {
                bloodPasswordValid = await loadBloodInformationMap();
            }
            if (patientPasswordValid && bloodPasswordValid) {
                setShowData(true);
            }
        } catch (error) {
            console.error('Failed to load record maps:', error);
        }
    };

    const loadPatientInformationMap = async () => {
        try {
            const newPatientInformationMapEncrypted = await deployedContract.methods.patientInformationMap().call();
            if (newPatientInformationMapEncrypted) {
                const patientInformationMapBytes = crypto.AES.decrypt(newPatientInformationMapEncrypted, passwordClearTextPatient);
                const decryptedData = JSON.parse(patientInformationMapBytes.toString(crypto.enc.Utf8));
                console.log(decryptedData)
                const patientInformationMap = decryptedData.patientData;
                const bloodInformationMap = decryptedData.bloodParameters;

                setPatientInformationMap(patientInformationMap);
                setBloodInformationMap(bloodInformationMap);
                setPatientPasswordError(false);
                return true;
            } else {
                console.error('No patient information map available.');
                return false;
            }
        } catch (error) {
            setPatientPasswordError(true);
            console.error('Failed to load patient information map:', error);
            return false;
        }
    };

    const loadBloodInformationMap = async () => {
        try {
            const newBloodInformationMapEncrypted = await deployedContract.methods.bloodInformationMap().call();
            if (newBloodInformationMapEncrypted) {
                const bloodInformationMapBytes = crypto.AES.decrypt(newBloodInformationMapEncrypted, passwordClearTextParameters);
                const decryptedData = JSON.parse(bloodInformationMapBytes.toString(crypto.enc.Utf8));
                setBloodInformationMap(decryptedData);
                setBloodPasswordError(false);
                return true;
            } else {
                console.error('No blood information map available.');
                return false;
            }
        } catch (error) {
            setBloodPasswordError(true);
            console.error('Failed to load blood information map:', error);
            return false;
        }
    };

    const loadContractFromAddress = async () => {
        try {
            const compiledContract = await fetchCompiledContract();
            const contract = new web3.eth.Contract(compiledContract.abi, contractAddress);
            setDeployedContract(contract);
            setDeployedAddress(contractAddress);
            setShowReadOptions(true);
        } catch (error) {
            setContractAddressError(true);
            console.error('Failed to load contract from address:', error);
        }
    };

    const TabBar = () => <div className={"Tab-bar"}>

        <h1 style={{width: "30%", textAlign: "center"}}>Record Blood Data</h1>
        <Button
            style={{paddingLeft: "30px", paddingRight: "30px", color: "white", fontSize: "20px",}}
            variant={"text"} onClick={() => handleModeChange("create")}>Create Contract</Button>
        <Button style={{paddingLeft: "30px", paddingRight: "30px", color: "white", fontSize: "20px",}}
                variant={"text"} onClick={() => handleModeChange("read")}> Read Existing Contract</Button>
    </div>

    const renderMenu = () => {
        switch (mode) {
            case 'create':
                return NewContractScreen(
                    deployContract,
                    deployedAddress,
                    handlePasswordClearTextChanged)
            case 'read':
                return ReadContract(
                    readOption,
                    showReadOptions,
                    contractAddressError,
                    loadContractFromAddress,
                    handleContractAddressChanged,
                    handleReadOptionChange,
                    handlePasswordClearTextBasicChanged,
                    patientPasswordError,
                    bloodPasswordError,
                    handlePasswordClearTextTailorChanged,
                    loadRecordMaps)
            default:
                return <></>
        }
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                {TabBar()}
                <div className="Content">
                    {renderMenu()}
                    {showUpdate &&
                        ShowUpdate(
                            updateRecordMaps,
                            addBloodParameter,
                            newBloodParameter,
                            handleBloodInformationMapChange,
                            handleNewBloodParameterChange,
                            handlePasswordClearTextTailorChanged,
                            handlePasswordClearTextBasicChanged,
                            handlePatientInformationMapChange,
                            bloodInformationMap,
                            patientInformationMap)
                    }
                    {showData &&
                        ShowData(
                            readOption,
                            patientInformationMap,
                            bloodInformationMap)

                    }
                </div>
            </div>
        </MuiThemeProvider>

    );


}

export default App;
