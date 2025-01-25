function editJobApplication() {
    document.getElementById("displayArea").innerHTML = `
        <h2>Edit Job Application</h2>
        <form id="jobForm">
            <label>Title: <input id="title" value="${jobData.title}"></label><br>
            <label>Company: <input id="company" value="${jobData.company}"></label><br>
            <label>Description: <textarea id="description">${jobData.description}</textarea></label><br>
            <button type="button" onclick="saveJobApplication()">Save</button>
        </form>
    `;
}

function saveJobApplication() {
    jobData.title = document.getElementById("title").value;
    jobData.company = document.getElementById("company").value;
    jobData.description = document.getElementById("description").value;
    localStorage.setItem("jobApplication", JSON.stringify(jobData));
    alert("Job application saved!");
    showJobApplication();
}

function showJobApplication() {
    displayArea.innerHTML = `<h2>Job Application</h2>
    <p><strong>Title:</strong> ${jobData.title}</p>
    <p><strong>Company:</strong> ${jobData.company}</p>
    <p><strong>Description:</strong></p>
    <pre style="white-space: pre-wrap;">${jobData.description}</pre>`;
}