import {Button, TextField} from "@material-ui/core";
import React from "react";

const ShowUpdate = (
    updateRecordMaps,
    addBloodParameter,
    newBloodParameter,
    handleBloodInformationMapChange,
    handleNewBloodParameterChange,
    handlePasswordClearTextTailorChanged,
    handlePasswordClearTextBasicChanged,
    handlePatientInformationMapChange,
    bloodInformationMap,
    patientInformationMap) =>
    <div className="Data-container">
        <h2 className="Title-margin">Set passwords to separately secure the data</h2>
        <div className="Flex-row">
            <TextField
                label={"Patient Password"}
                style={{marginLeft: "2vw", width: "10vw"}}
                type={"password"}
                onChange={handlePasswordClearTextBasicChanged}
            />
            <TextField
                label={"Blood Password"}
                style={{marginLeft: "2vw", width: "10vw"}}
                type={"password"}
                onChange={handlePasswordClearTextTailorChanged}
            />
        </div>
        <h2 className="Title-margin">Basic Blood Information</h2>
        <div className="Flex-row">
            {Object.keys(patientInformationMap).map((key) => (
                <div key={key}>
                    <TextField
                        label={key}
                        style={{marginLeft: "2vw", width: "10vw"}}
                        onChange={(e) => handlePatientInformationMapChange(e, key)}
                    />
                </div>
            ))}
        </div>
        <h2 className="Title-margin">Blood Parameters Information</h2>

        {bloodInformationMap.map((item, index) => (
            <div key={index}>
                <TextField
                    label={"Parameter"}
                    style={{marginLeft: "2vw", width: "10vw"}}
                    value={item.name}
                    onChange={(e) => handleBloodInformationMapChange(index, 'name', e.target.value)}
                />
                <TextField
                    label={"Result"}
                    style={{marginLeft: "2vw", width: "10vw"}}
                    value={item.result}
                    onChange={(e) => handleBloodInformationMapChange(index, 'result', e.target.value)}
                />
                <TextField
                    label={"Unit"}
                    style={{marginLeft: "2vw", width: "10vw"}}
                    value={item.unit}
                    onChange={(e) => handleBloodInformationMapChange(index, 'unit', e.target.value)}
                />
            </div>
        ))}
        <div className="Flex-row">
            <TextField
                label={"Parameter"}
                style={{marginLeft: "2vw", width: "10vw"}}
                value={newBloodParameter.name}
                onChange={(e) => handleNewBloodParameterChange('name', e.target.value)}
            />
            <TextField
                label={"Result"}
                style={{marginLeft: "2vw", width: "10vw"}}
                value={newBloodParameter.result}
                onChange={(e) => handleNewBloodParameterChange('result', e.target.value)}
            />
            <TextField
                label={"Unit"}
                style={{marginLeft: "2vw", width: "10vw"}}
                value={newBloodParameter.unit}
                onChange={(e) => handleNewBloodParameterChange('unit', e.target.value)}
            />
            <Button
                style={{alignSelf: "center", marginLeft: '2vw', height: '4vh', color: "white", background: "#002d65"}}
                variant={"outlined"} onClick={addBloodParameter}><b>+</b></Button>
        </div>
        <Button style={{marginTop: "7vh", marginLeft: '2vw', width: '13vw', color: "white", background: "#002d65"}}
                variant={"contained"} onClick={updateRecordMaps}>Update Record Maps</Button>
    < /div>

export default ShowUpdate;