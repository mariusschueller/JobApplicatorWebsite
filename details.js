let professionalDetails = JSON.parse(localStorage.getItem("professionalDetails")) || [];

        function showProfessionalDetails() {
            let html = "<h2>Professional Details</h2>";
            professionalDetails.forEach((detail, index) => {
                html += `<div>
                            <h3>${detail.title}</h3>
                            <p><strong>Dates:</strong> ${detail.dates}</p>
                            <p><strong>Location:</strong> ${detail.location}</p>
                            <p><strong>Role:</strong> ${detail.role}</p>
                            <ul>${detail.bulletPoints.map(b => `<li>${b}</li>`).join("")}</ul>
                            <button onclick="editProfessionalDetail(${index})">Edit</button>
                         </div>`;
            });
            displayArea.innerHTML = html;
        }

        function editProfessionalDetail(index) {
            const detail = professionalDetails[index];
            document.getElementById("displayArea").innerHTML = `
            <h2>Edit Professional Detail</h2>
            <form id="professionalForm">
                <label>Title: <input id="title" value="${detail.title}"></label><br>
                <label>Dates: <input id="dates" value="${detail.dates}"></label><br>
                <label>Location: <input id="location" value="${detail.location}"></label><br>
                <label>Role: <input id="role" value="${detail.role}"></label><br>
                <label>Bullet Points: <textarea id="bulletPoints">${detail.bulletPoints.join("\n")}</textarea></label><br>
                <button type="button" onclick="saveProfessionalDetail(${index})">Save</button>
                <button type="button" onclick="deleteProfessionalDetail(${index})">Delete</button>
            </form>
            `;
        }

        function deleteProfessionalDetail(index) {
            if (confirm("Are you sure you want to delete this professional detail?")) {
                professionalDetails.splice(index, 1);
                localStorage.setItem("professionalDetails", JSON.stringify(professionalDetails));
                showProfessionalDetails();
            }
        }

        function saveProfessionalDetail(index) {
            const detail = {
                title: document.getElementById("title").value,
                dates: document.getElementById("dates").value,
                location: document.getElementById("location").value,
                role: document.getElementById("role").value,
                bulletPoints: document.getElementById("bulletPoints").value.split("\n").filter(b => b.trim())
            };
            professionalDetails[index] = detail;
            localStorage.setItem("professionalDetails", JSON.stringify(professionalDetails));
            alert("Professional detail saved!");
            showProfessionalDetails();
        }

        function addProfessionalDetail() {
            const newDetail = {
                title: "New Title",
                dates: "New Dates",
                location: "New Location",
                role: "New Role",
                bulletPoints: ["New Bullet Point"]
            };
            professionalDetails.push(newDetail);
            editProfessionalDetail(professionalDetails.length - 1);
        }

        /* -------- EXPERIENCE DETAILS -------- */

        let experienceDetails = JSON.parse(localStorage.getItem("experienceDetails")) || [];

        function showExperienceDetails() {
            let html = "<h2>Experience Details</h2>";
            experienceDetails.forEach((detail, index) => {
                html += `<div>
                            <h3>${detail.title}</h3>
                            <p><strong>Dates:</strong> ${detail.dates}</p>
                            <p><strong>Location:</strong> ${detail.location}</p>
                            <p><strong>Role:</strong> ${detail.role}</p>
                            <ul>${detail.bulletPoints.map(b => `<li>${b}</li>`).join("")}</ul>
                            <button onclick="editExperienceDetail(${index})">Edit</button>
                         </div>`;
            });
            displayArea.innerHTML = html;
        }

        function editExperienceDetail(index) {
            const detail = experienceDetails[index];
            document.getElementById("displayArea").innerHTML = `
            <h2>Edit Experience Detail</h2>
            <form id="experienceForm">
                <label>Title: <input id="title" value="${detail.title}"></label><br>
                <label>Dates: <input id="dates" value="${detail.dates}"></label><br>
                <label>Location: <input id="location" value="${detail.location}"></label><br>
                <label>Role: <input id="role" value="${detail.role}"></label><br>
                <label>Bullet Points: <textarea id="bulletPoints">${detail.bulletPoints.join("\n")}</textarea></label><br>
                <button type="button" onclick="saveExperienceDetail(${index})">Save</button>
                <button type="button" onclick="deleteExperienceDetail(${index})">Delete</button>
            </form>
            `;
        }

        function
            deleteExperienceDetail(index) {
            if (confirm("Are you sure you want to delete this Experience detail?")) {
                experienceDetails.splice(index, 1);
                localStorage.setItem("experienceDetails", JSON.stringify(experienceDetails));
                showExperienceDetails();
            }
        }

        function
            saveExperienceDetail(index) {
            const
                detail = {
                    title: document.getElementById("title").value,
                    dates: document.getElementById("dates").value,
                    location: document.getElementById("location").value,
                    role: document.getElementById("role").value,
                    bulletPoints: document.getElementById("bulletPoints").value.split("\n").filter(b => b.trim())
                };
            experienceDetails[index] = detail;
            localStorage.setItem("experienceDetails", JSON.stringify(experienceDetails));
            alert("Experience detail saved!");
            showExperienceDetails();
        }

        function addExperienceDetail() {
            const newDetail = {
                title: "New Title",
                dates: "New Dates",
                location: "New Location",
                role: "New Role",
                bulletPoints: ["New Bullet Point"]
            };
            experienceDetails.push(newDetail);
            editExperienceDetail(experienceDetails.length - 1);
        }
