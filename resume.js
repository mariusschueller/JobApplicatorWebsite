async function generateResume() {
    console.log("generating resume...");

    const data = JSON.parse(localStorage.getItem("applicantData"));
    const professionalDetails = JSON.parse(localStorage.getItem("aiSelectedProfessionalDetails")) || [];
    const experienceDetails = JSON.parse(localStorage.getItem("aiSelectedExperienceDetails")) || [];
    const languages = ["Python", "JavaScript", "Java", "C", "C#", "C++", "TypeScript", "Swift", "Kotlin", "PHP", "Rust",
        "Go", "Ruby", "SQL", "R", "MATLAB", "Shell", "Objective-C", "Assembly", "Prolog", "PowerShell",
        "Bash", "HTML", "CSS", "XML", "Unity", "Arduino", "Unreal Engine", "Agile"];

    function boldLanguages(text) {
        languages.forEach(language => {
            const regex = new RegExp(`\\b${language.replace(/\+/g, '\\+')}\\b`, 'g');
            text = text.replace(regex, `<span class='bold'>${language}</span>`);
        });
        return text;
    }

    function boldNumbers(text) {
        return text.replace(/\b\d+\b/g, '<span class="bold">$&</span>');
    }

    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    @page { size: A4; margin: 0.25in; }
    body { font-family: 'Times New Roman', serif; font-size: 11px; line-height: .6; margin: 0; width: 100%; height: auto; }
    #title { font-size: 18px; text-align: center; font-weight: bold; margin-top: 30px; }
    p { padding-left: 10px; padding-right: 10px; }
    .section p { margin-bottom: -4px; }
    .bold { font-weight: bold; }
    #subheader { text-align: center; }
    .category { text-align: center; font-weight: bold; text-decoration: underline; }
    hr { border: none; height: 2px; width: 95%; background-color: black; }
    .italic { font-style: italic; }
    .right { float: right; }
    .role { line-height:1; }
    .bullet { line-height:1.25; padding-bottom: 0px; margin: 0; }
    </style>
    </head>
    <body>`;

    html += `<p id='title'>${data.name}</p>`;
    html += `<p id='subheader'>${data.location} | ${data.phone} | <a href='${data.website}'>${data.website}</a> | <a href='${data.github}'>${data.github}</a> | ${data.email}</p>`;
    html += "<hr>";

    html += "<p class='category'>EDUCATION</p>";
    html += `<div class='section'>
    <p><span class='bold'>${data.school}</span><span class='right bold'>${data.gradYear}</span></p>
    <p><span class='bold'>Majors: </span>${data.major}</p>
    <p><span class='bold'>Minors: </span>${data.minor}</p>
    <p><span class='bold'>Cumulative GPA: </span>${data.gpa}</p>
    <p><span class='bold' style='line-height: 2;'>Coursework: </span>${data.classes}</p>
    </div><br>`;

    html += "<p class='category'>PROFESSIONAL EXPERIENCE</p>";
    html += "<div class='section'>";
    professionalDetails.forEach(detail => {
        html += `<p><span class='bold'>${detail.title}</span>, ${detail.location}<span class='bold right'>${detail.dates}</span></p>`;
        html += `<p class='role italic'>&nbsp;${detail.role}</p><br>`;
        detail.bulletPoints.forEach(bullet => {
            html += `<p class='bullet'>&nbsp;&#x2022; ${boldNumbers(boldLanguages(bullet))}</p><br>`;
        });
        html += "<br>";
    });
    html += "</div>";

    html += "<p class='category'>ACTIVITIES AND PROJECTS</p>";
    html += "<div class='section'>";
    experienceDetails.forEach(detail => {
        let location = detail.location;
        if (location.startsWith("http://") || location.startsWith("https://")) {
            location = `<a href='${location}'>${location}</a>`;
        }
        html += `<p><span class='bold'>${detail.title}</span>, ${location}<span class='bold right'>${detail.dates}</span></p>`;
        html += `<p class='role italic'>&nbsp;${detail.role}</p><br>`;
        detail.bulletPoints.forEach(bullet => {
            html += `<p class='bullet'>&nbsp;&#x2022; ${boldNumbers(boldLanguages(bullet))}</p><br>`;
        });
        html += "<br>";
    });
    html += "</div>";

    html += "<p class='category'>SKILLS AND INTERESTS</p>";
    html += `<div class='section'>
    <p><span class='bold'>Languages: </span>${data.languages}</p>
    <p><span class='bold'>Technologies: </span>${data.technologies}</p>
    </div>`;

    html += "</body></html>";

    const newTab = window.open();
    newTab.document.write(html);
    newTab.document.close();
}