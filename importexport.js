function exportLocalStorage() {
    const data = {
        applicantData: localStorage.getItem("applicantData"),
        professionalDetails: localStorage.getItem("professionalDetails"),
        experienceDetails: localStorage.getItem("experienceDetails"),
        jobApplication: localStorage.getItem("jobApplication"),
        extractedKeywords: localStorage.getItem("extractedKeywords")
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "localStorageData.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importLocalStorage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const data = JSON.parse(event.target.result);
        localStorage.setItem("applicantData", data.applicantData);
        localStorage.setItem("professionalDetails", data.professionalDetails);
        localStorage.setItem("experienceDetails", data.experienceDetails);
        localStorage.setItem("jobApplication", data.jobApplication);
        localStorage.setItem("extractedKeywords", data.extractedKeywords);
        alert("Local storage data imported successfully!");
        location.reload(); // Refresh the page to reflect the imported data
    };
    reader.readAsText(file);
}