async function decideBestBulletPoints(bulletPoints) {
    if (bulletPoints.length <= 3) {
        return bulletPoints;
    }

    const systemPrompt = "I'm going to give you a list of numbered bullet points for a resume. I want you to give me the numbers and just the numbers of the 3 most relevant bullet points separated by commas. Say \"1, 2\" if there are only 2 bullet points.";
    const userPrompt = `Description: ${jobData.description}\nBullet Points: ${bulletPoints.map((b, i) => `${i + 1}: ${b}`).join("\n")}`;

    try {
        const response = await generateAIContent(systemPrompt, userPrompt);
        const bulletNums = response.split(',').map(num => parseInt(num.trim()) - 1);

        const relevantBullets = bulletNums.map(num => bulletPoints[num]);
        console.log("Using bullets", relevantBullets);

        return relevantBullets;
    } catch (error) {
        console.error("Error deciding best bullet points:", error);
        return bulletPoints.slice(0, 3); // Fallback to the first 3 bullet points
    }
}

async function addKeywordsBulletPoints() {
    const professionalDetails = JSON.parse(localStorage.getItem("aiSelectedProfessionalDetails")) || [];
    const experienceDetails = JSON.parse(localStorage.getItem("aiSelectedExperienceDetails")) || [];
    const allDetails = [...professionalDetails, ...experienceDetails];

    let bulletPoints = [];
    allDetails.forEach((detail, detailIndex) => {
        detail.bulletPoints.forEach((bullet, bulletIndex) => {
            bulletPoints.push({ detailIndex, bulletIndex, bullet });
        });
    });

    while (missingKeywords.length > 0) {
        const { detailIndex, bulletIndex, bullet } = bulletPoints[i];
        const keywords = JSON.parse(localStorage.getItem("extractedKeywords")) || { keywords: [] };

        const systemPrompt = "You are a job application assistant used for resumes. You will be given a list of bullet points and keywords. Identify the number of the best bullet point to use and which keywords to add to that bullet point in the format 0:keyword1, keyword2. Do not include the bullet point text.";
        const userPrompt = `Bullet Points: ${bulletPoints.map((bp, index) => `${index}: ${bp.bullet}`).join("\n")}\nKeywords: ${missingKeywords.join(", ")}`;
        console.log(userPrompt);
        const response = await generateAIContent(systemPrompt, userPrompt);
        console.log(response);
        const lines = response.split('\n').map(line => line.trim()).filter(Boolean);
        const [indexStr, bulletContent] = lines[0].split(':');
        const bestBulletIndex = parseInt(indexStr.trim());
        const bestBullet = bulletPoints[bestBulletIndex].bullet;

        let selectedKeywords = [];
        if (bulletContent) {
            selectedKeywords = bulletContent.split(',').map(k => k.trim());
        }
        const newBulletPoint = `${bestBullet} (${selectedKeywords.join(", ")})`;
        console.log(`Bullet Point Index: ${bestBulletIndex}`);
        console.log(`Original Bullet Point: ${bestBullet}`);
        console.log(`Selected Keywords: ${selectedKeywords.join(", ")}`);
        
        // now call the bullet point logic to add selected keywords to the selected bullet point (get new bullet point) 
        // Do this with new function autoBulletRewrite
        // bullet point gets 5 tries before being reset, and that happens 5 times
        // save the bullet point, check the keyword list to see if any weren't used 
        // for any that weren't used, remove the keyword, or maybe use another call to get the used version of that keyword, or maybe stem and lemmetize???
        // save the updated list of keywords and bullet points

        // repeat the above until there are no more keywords left

        // the below uses the detail index
        if (detailIndex < professionalDetails.length) {
             professionalDetails[detailIndex].bulletPoints[bulletIndex] = newBulletPoint;
         } else {
             experienceDetails[detailIndex - professionalDetails.length].bulletPoints[bulletIndex] = newBulletPoint;
         }
    

    //localStorage.setItem("aiSelectedProfessionalDetails", JSON.stringify(professionalDetails));
    //localStorage.setItem("aiSelectedExperienceDetails", JSON.stringify(experienceDetails));
    //showAIExperiences();
}

// NOTE THAT detailIndex MIGHT BE DIFFERENT THEN ADD KEYWORDSBULLETPOINTS
async function autoBulletRewrite(type, detailIndex, bulletIndex, keywordsToAdd) {
    const allDetails = JSON.parse(localStorage.getItem(`aiSelected${type.charAt(0).toUpperCase() + type.slice(1)}`)) || [];
    const detail = allDetails[detailIndex];
    const bulletPoint = detail.bulletPoints[bulletIndex];

    
    

    console.log(userPrompt);
    let newBulletPoint;
    let count = 0;
    
    do {
    let systemPrompt = "You are a job application assistant used for resumes. You will be given keywords. Your job is to take the given bullet point and rewrite it to include relevant keywords. The amount of characters is required to be less than 150";
    let userPrompt = `Keywords: ${keywordsToAdd.join(", ")}\nBullet Point: ${bulletPoint}\n`;
    do {
        newBulletPoint = await generateAIContent(systemPrompt, userPrompt);
        console.log("generating new bullet point...");
        if (newBulletPoint.length > 175) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be shorter by one word";
        }
        else if (newBulletPoint.length < 110) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be longer";
        }
        else if (newBulletPoint.length < 130) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be longer by one word";
        } else if (newBulletPoint.length > 150) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be shorter";
        }
        userPrompt = `Keywords: ${missingKeywords.join(", ")}\nBullet Point: ${newBulletPoint}\n`;
        count++;
    } while (count%5 < 5 && (newBulletPoint.length > 150 || newBulletPoint.length < 130));
}while(count < 50)
if (newBulletPoint.length > 150 || newBulletPoint.length < 130){
    alert("failed to generate bullet point in over 50 attemps");
}

    if (newBulletPoint.endsWith(".")) {
        newBulletPoint = newBulletPoint.slice(0, -1);
    }
    if (newBulletPoint.startsWith("Bullet Point: ")) {
        newBulletPoint = newBulletPoint.slice(14);
    }
    detail.bulletPoints[bulletIndex] = newBulletPoint;
    localStorage.setItem(`aiSelected${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(allDetails));
    showAIExperiences();
}
}

function editBulletPoint(type, detailIndex, bulletIndex) {
    const allDetails = JSON.parse(localStorage.getItem(`aiSelected${type.charAt(0).toUpperCase() + type.slice(1)}`)) || [];
    const detail = allDetails[detailIndex];
    const bulletPoint = detail.bulletPoints[bulletIndex];

    const newBulletPoint = prompt("Edit Bullet Point:", bulletPoint);
    if (newBulletPoint !== null) {
        detail.bulletPoints[bulletIndex] = newBulletPoint;
        localStorage.setItem(`aiSelected${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(allDetails));
        showAIExperiences();
    }
}

async function rewriteBulletPoint(type, detailIndex, bulletIndex) {
    const allDetails = JSON.parse(localStorage.getItem(`aiSelected${type.charAt(0).toUpperCase() + type.slice(1)}`)) || [];
    const detail = allDetails[detailIndex];
    const bulletPoint = detail.bulletPoints[bulletIndex];

    const keywords = JSON.parse(localStorage.getItem("extractedKeywords")) || { keywords: [] };

    let systemPrompt = "You are a job application assistant used for resumes. You will be given keywords. Your job is to take the given bullet point and rewrite it to include relevant keywords. The amount of characters is required to be less than 150";
    let userPrompt = `Keywords: ${missingKeywords.join(", ")}\nBullet Point: ${bulletPoint}\n`;

    console.log(userPrompt);
    let newBulletPoint;
    let count = 0;
    do {
        newBulletPoint = await generateAIContent(systemPrompt, userPrompt);
        console.log("generating new bullet point...");
        if (newBulletPoint.length > 175) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be shorter by one word";
        }
        else if (newBulletPoint.length < 110) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be longer";
        }
        else if (newBulletPoint.length < 130) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be longer by one word";
        } else if (newBulletPoint.length > 150) {
            systemPrompt = "You are a job application assistant used for resumes. You need to rewrite this bullet point to be shorter";
        }
        userPrompt = `Keywords: ${missingKeywords.join(", ")}\nBullet Point: ${newBulletPoint}\n`;
        count++;
    } while (count < 5 && (newBulletPoint.length > 150 || newBulletPoint.length < 130));
    if (count == 5) {
        alert("Failed to generate a new bullet point. Please try again.");
        return;
    }
    if (newBulletPoint.endsWith(".")) {
        newBulletPoint = newBulletPoint.slice(0, -1);
    }
    if (newBulletPoint.startsWith("Bullet Point: ")) {
        newBulletPoint = newBulletPoint.slice(14);
    }
    detail.bulletPoints[bulletIndex] = newBulletPoint;
    localStorage.setItem(`aiSelected${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(allDetails));
    showAIExperiences();
}