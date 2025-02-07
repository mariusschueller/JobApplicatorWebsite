async function companyParagraph() {
    console.log("generating cover company paragraph...");

    const filteredKeywords = JSON.parse(localStorage.getItem("extractedKeywords")) || { keywords: [] };

    const systemPrompt = "You are writing a cover letter. You will be given a company and a job description. Talk about something specific about that company for an applicant. Add keywords if they're relevant. The paragraph should be 3 sentences.";
    const userPrompt = `keywords: ${filteredKeywords.keywords.join(", ")}\ncompany: ${jobData.company}\njob description: ${jobData.description}`;
    console.log(userPrompt);
    const paragraph = await generateAIContent(systemPrompt, userPrompt);

    return paragraph;
}

async function meCoverLetter() {
    console.log("generating cover me paragraph...");

    const filteredKeywords = JSON.parse(localStorage.getItem("extractedKeywords")) || { keywords: [] };

    let allExperiences = "";
    professionalDetails.forEach((detail, index) => {
        allExperiences += `${index + 1}: ${detail.title}. ${detail.bulletPoints.join(". ")}. \n`;
    });

    experienceDetails.forEach((detail, index) => {
        allExperiences += `${index + professionalDetails.length + 1}: ${detail.title}. ${detail.bulletPoints.join(". ")}. \n`;
    });

    const systemPrompt = "I'm going to give you a list of numbered experiences for a resume. I want you to give me the number and just the number of the most relevant experience.";
    const userPrompt = `Job description: ${jobData.description}\nExperiences: ${allExperiences}`;

    const response = await generateAIContent(systemPrompt, userPrompt);
    const answer = parseInt(response) - 1;

    let experience;
    if (answer < professionalDetails.length) {
        experience = `${professionalDetails[answer].title}: ${professionalDetails[answer].bulletPoints.join(". ")}`;
    } else {
        const expIndex = answer - professionalDetails.length;
        experience = `${experienceDetails[expIndex].title}: ${experienceDetails[expIndex].bulletPoints.join(". ")}`;
    }

    const coverSystemPrompt = "You are writing a cover letter. I want you to write a paragraph of 3 sentences based on the given experience. Also add in the given keywords if relevant.";
    const coverUserPrompt = `keywords: ${filteredKeywords.keywords.join(", ")}\nexperience: ${experience}`;

    const paragraph = await generateAIContent(coverSystemPrompt, coverUserPrompt);

    return paragraph;
}



async function generateCoverLetter() {
    displayArea.innerHTML = `<h2>Generating Cover Letter...</h2>`
    
    const preletter = `${data.name}
${data.phone}
${data.email}

Dear Hiring Team,
`;
    // 
    const intro = `I am very interested in the ${jobData.title} position at ${jobData.company}. As a highly skilled and motivated programmer with a passion for innovation, I believe that my technical expertise and dedication to excellence make me an ideal candidate for this role.`;

    const meParagraph = await meCoverLetter();

    const comParagraph = await companyParagraph();

    const passionParagraph = `What excites me is the chance to continuously grow as a programmer while making a meaningful impact on people's lives. As someone with a strong growth mindset, I am constantly seeking out challenges that push me to learn new skills, explore different technologies, and refine my problem-solving abilities. I'm excited by the prospect of working with a team that shares a similar passion for learning and innovation.`;

    const endParagraph = `In closing, I am thrilled about the opportunity to join the talented team at ${jobData.company} and contribute. I am confident that my technical expertise, passion for innovation, and dedication to excellence make me a strong fit for this role. Thank you for considering my application. I look forward to the possibility of discussing how my skills and experience align with ${jobData.company}'s vision.`;

    const postParagragh = `Cheers,
${data.name}`;
    const coverLetter = `${preletter}${intro} \n\n${meParagraph} \n\n${comParagraph} \n\n${passionParagraph} \n\n${postParagragh}`;
    
    displayArea.innerHTML = `<button onclick="showAIExperiences(false, true)">Show Generated</button> `
    displayArea.innerHTML += `<button onclick="generateResume()">Get Resume</button> <br><br>`
    displayArea.innerHTML += `<pre style="text-wrap: wrap;">${coverLetter}</pre>`;
    
}