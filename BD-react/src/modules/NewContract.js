import React from "react";
import {Button, TextField} from "@material-ui/core";

const NewContractScreen = (
    deployContract,
    deployedAddress,
    handlePasswordClearTextChanged,
) =>
    <div className="Left-card">
        <h2>Deploy New Contract</h2>
        <p>Save patient blood data in a secure, encrypted contract.</p>
        <div className="Left-card-content">
            <TextField id="outlined-basic" label="Contract Password" variant="outlined"
                       onChange={handlePasswordClearTextChanged}/>
            <Button variant={"contained"}
                    style={{marginTop: "20px", marginBottom: "10px", color: "white", background: "#002d65"}}
                    onClick={deployContract}>Deploy</Button>
            {deployedAddress &&
                <div>
                    <h4>Contract created successfully</h4>
                    <p>Address: {deployedAddress}</p>
                </div>}
        </div>
    </div>

export default NewContractScreen