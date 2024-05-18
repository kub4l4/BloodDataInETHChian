import {Button} from "@material-ui/core";
import React from "react";

const TabBar = (onClickCreate, onClickRead) => (<div style={{
    color: "white", display: "flex", flexDirection: "row", alignItems: "stretch", background: "#002d65"
}}>
    <h1 style={{padding: "10px", marginRight: "5vw"}}>Record Blood Data</h1>
    <Button
        style={{paddingLeft: "30px", paddingRight: "30px", color: "white", fontSize: "20px",}}
        variant={"text"}
        onClick={() => onClickCreate}>Create Contract</Button>
    <Button
        style={{paddingLeft: "30px", paddingRight: "30px", color: "white", fontSize: "20px",}}
        variant={"text"}
        onClick={() => onClickRead}> Read Existing Contract</Button>
</div>);


export default TabBar;