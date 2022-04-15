import React, { useEffect } from "react";
import { IconButton } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';

const FileImporter = (props) => {

    function buildFileSelector() {
        const fileSelector = document.createElement("input");
        fileSelector.setAttribute("type", "file");
        fileSelector.setAttribute("multiple", "false");
        fileSelector.onchange = (evt) => {
            console.log(evt)
            const reader = new FileReader()
            reader.onload = (e) => { 
                const text = (e.target.result)
                props.handleText(text)
            };
            reader.readAsText(evt.target.files[0])
        }
        return fileSelector;
    }

    const fileSelector = buildFileSelector();

    const handleFileSelect = (e) => {
        e.preventDefault();
        fileSelector.click();
    }

    return (
        <IconButton onClick={handleFileSelect}>
            <FileUploadIcon/>
        </IconButton>
    )
};
export default FileImporter;
