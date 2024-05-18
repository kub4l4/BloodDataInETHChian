import React from "react";

const ShowData = (
    readOption,
    patientInformationMap,
    bloodInformationMap
) =>
    <div className="Data-container">
        {(readOption === 'patient' ) && (
            <>
                <h2 className="Title-margin">Basic Blood Information</h2>
                {Object.keys(patientInformationMap).map((key) => (
                    <p className="Data-list"  key={key}>
                        <b>{key}</b>: {patientInformationMap[key]}
                    </p>
                ))}
            </>)}
            <>
                <h2 className="Title-margin">Blood Parameters Information</h2>
                {bloodInformationMap.map((item, key) => (
                    <p className="Data-list"  key={key}>
                        <b>{item.name}</b>: {item.result}{item.unit}
                    </p>
                ))}
            </>
    </div>

export default ShowData;
