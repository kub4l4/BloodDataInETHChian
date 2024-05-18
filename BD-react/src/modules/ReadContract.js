import React from "react";
import {Button, MenuItem, TextField} from "@material-ui/core";

const ReadContract = (
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
    loadRecordMaps
) => {


    return (
        <div className="Left-card">
            <h2>Load Existing Contract</h2>
            <p>Read data based on permissions you have</p>

            <div className="Left-card-content">
                <TextField variant={"outlined"} label={"Contract Address"} type="text"
                           onChange={handleContractAddressChanged}
                           error={contractAddressError} helperText={contractAddressError ? "Invalid" : ""}/>
                <Button variant={"contained"}
                        style={{marginTop: "20px", marginBottom: "10px", color: "white", background: "#002d65"}}
                        onClick={loadContractFromAddress}>Load Contract</Button>


                {showReadOptions && (
                    <div className="Flex-column">
                        <label style={{alignSelf: "flex-start"}}>Select Data to Read:</label>

                        <TextField variant={"outlined"} select value={readOption} onChange={handleReadOptionChange}>
                            <MenuItem value={'patient'}>Patient Info</MenuItem>
                            <MenuItem value={'blood'}>Blood Info</MenuItem>
                        </TextField>

                        <TextField
                            label={"Patient Password"}
                            style={{
                                marginTop: "20px",
                                display: (readOption === 'patient') ? "grid" : "none"
                            }}
                            variant={"outlined"}
                            type={"password"}
                            onChange={handlePasswordClearTextBasicChanged}
                            error={patientPasswordError}
                            aria-errormessage={"Patient password is wrong"}
                        />

                        <TextField
                            label={"Blood Password"}
                            style={{
                                marginTop: "20px",
                                display: (readOption === 'blood') ? "grid" : "none"
                            }}
                            variant={"outlined"}
                            type={"password"}
                            onChange={handlePasswordClearTextTailorChanged}
                            error={bloodPasswordError}
                            aria-errormessage={"Blood password is wrong"}
                        />

                        <Button variant={"contained"}
                                style={{marginTop: "20px", color: "white", background: "#002d65"}}
                                onClick={loadRecordMaps}>Load Data</Button>


                    </div>)
                }
            </div>

        </div>
    )

}
export default ReadContract;
