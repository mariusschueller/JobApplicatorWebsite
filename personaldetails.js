function showPersonalDetails() {
    displayArea.innerHTML = `<h2>Current Personal Information</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Major:</strong> ${data.major}</p>
    <p><strong>Minor:</strong> ${data.minor}</p>
    <p><strong>GPA:</strong> ${data.gpa}</p>
    <p><strong>School:</strong> ${data.school}</p>
    <p><strong>Graduation Year:</strong> ${data.gradYear}</p>
    <p><strong>Website:</strong> <a href="${data.website}">${data.website}</a></p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>GitHub:</strong> <a href="${data.github}">${data.github}</a></p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Classes:</strong> ${data.classes}</p>
    <p><strong>Languages:</strong> ${data.languages}</p>
    <p><strong>Technologies:</strong> ${data.technologies}</p>`;
}

function editPersonalDetails() {
    document.getElementById("displayArea").innerHTML = `
    <h2>Edit Personal Details</h2>
    <form id="editForm">
        <label>Name: <input id="name" value="${data.name}"></label><br>
        <label>Location: <input id="location" value="${data.location}"></label><br>
        <label>Major: <input id="major" value="${data.major}"></label><br>
        <label>Minor: <input id="minor" value="${data.minor}"></label><br>
        <label>GPA: <input id="gpa" value="${data.gpa}"></label><br>
        <label>School: <input id="school" value="${data.school}"></label><br>
        <label>Graduation Year: <input id="gradYear" value="${data.gradYear}"></label><br>
        <label>Website: <input id="website" value="${data.website}"></label><br>
        <label>Email: <input id="email" value="${data.email}"></label><br>
        <label>GitHub: <input id="github" value="${data.github}"></label><br>
        <label>Phone: <input id="phone" value="${data.phone}"></label><br>
        <label>Classes: <input id="classes" value="${data.classes}"></label><br>
        <label>Languages: <input id="languages" value="${data.languages}"></label><br>
        <label>Technologies: <input id="technologies" value="${data.technologies}"></label><br>
        <button type="button" onclick="savePersonalDetails()">Save</button>
    </form>
    `;
}

function savePersonalDetails() {
    data.name = document.getElementById("name").value;
    data.location = document.getElementById("location").value;
    data.major = document.getElementById("major").value;
    data.minor = document.getElementById("minor").value;
    data.gpa = document.getElementById("gpa").value;
    data.school = document.getElementById("school").value;
    data.gradYear = document.getElementById("gradYear").value;
    data.website = document.getElementById("website").value;
    data.email = document.getElementById("email").value;
    data.github = document.getElementById("github").value;
    data.phone = document.getElementById("phone").value;
    data.classes = document.getElementById("classes").value;
    data.languages = document.getElementById("languages").value;
    data.technologies = document.getElementById("technologies").value;
    localStorage.setItem("applicantData", JSON.stringify(data));
    alert("Personal details saved!");
    showPersonalDetails();
}