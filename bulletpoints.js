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
async function rewriteLeftoverBulletPoints() {
    const professionalDetails = JSON.parse(localStorage.getItem("aiSelectedProfessionalDetails")) || [];
    const experienceDetails = JSON.parse(localStorage.getItem("aiSelectedExperienceDetails")) || [];
    const allDetails = [...professionalDetails, ...experienceDetails];
    const rewriteTasks = [];

    for (let detailIndex = 0; detailIndex < allDetails.length; detailIndex++) {
        const detail = allDetails[detailIndex];
        for (let bulletIndex = 0; bulletIndex < detail.bulletPoints.length; bulletIndex++) {
            let bullet = detail.bulletPoints[bulletIndex];
            if (bullet.length < 130 || bullet.length > 150) {
                rewriteTasks.push((async () => {
                    console.log("Rewriting bullet point:", bullet);
                    let newBulletPoint = bullet;
                    let count = 0;
                    let systemPrompt = "You are a job application assistant used for resumes. Fix the bullet to 130-150 characters.";

                    do {
                        if (newBulletPoint.length > 150) {
                            console.log("TOO LONG", newBulletPoint.length);
                            const overshoot = newBulletPoint.length - 140;
                            const wordsToRemove = Math.ceil(overshoot / 5);
                            systemPrompt = `You are a job application assistant used for resumes. Rewrite this bullet to be shorter by ${wordsToRemove} word(s)`;
                        } else if (newBulletPoint.length < 130) {
                            console.log("TOO SHORT", newBulletPoint.length);
                            const belowTarget = 140 - newBulletPoint.length;
                            const wordsToAdd = Math.ceil(belowTarget / 5);
                            systemPrompt = `You are a job application assistant used for resumes. Rewrite this bullet to be longer by ${wordsToAdd} word(s)`;
                        }
                        
                        const userPrompt = `Bullet Point: ${newBulletPoint}`;
                        newBulletPoint = await generateAIContent(systemPrompt, userPrompt);

                        if (newBulletPoint.endsWith(".")) newBulletPoint = newBulletPoint.slice(0, -1);
                        if (newBulletPoint.startsWith("Bullet Point: ")) newBulletPoint = newBulletPoint.slice(14);
                        if (newBulletPoint.startsWith("- ")) newBulletPoint = newBulletPoint.slice(2);
                        
                        count++;
                    } while ((newBulletPoint.length > 150 || newBulletPoint.length < 130) && count < 50);

                    if (newBulletPoint.length >= 130 && newBulletPoint.length <= 150) {
                        detail.bulletPoints[bulletIndex] = newBulletPoint;
                    }
                    console.log(count + " Rewritten bullet point!");
                })());
            }
        }
    }

    await Promise.all(rewriteTasks);
    localStorage.setItem("aiSelectedProfessionalDetails", JSON.stringify(professionalDetails));
    localStorage.setItem("aiSelectedExperienceDetails", JSON.stringify(experienceDetails));
    showAIExperiences();
    console.log("All bullet points rewritten successfully!");
    alert("All bullet points rewritten successfully!");
}

async function addKeywordsBulletPoints() {
    while (missingKeywords.length > 0) {
        const professionalDetails = JSON.parse(localStorage.getItem("aiSelectedProfessionalDetails")) || [];
        const experienceDetails = JSON.parse(localStorage.getItem("aiSelectedExperienceDetails")) || [];
        const allDetails = [...professionalDetails, ...experienceDetails];

        let bulletPoints = [];
        allDetails.forEach((detail, detailIndex) => {
            detail.bulletPoints.forEach((bullet, bulletIndex) => {
                if (bullet.length < 130 || bullet.length > 150) {
                    bulletPoints.push({ detailIndex, bulletIndex, bullet });
                }
            });
        });

        keywords = JSON.parse(localStorage.getItem("extractedKeywords")) || { keywords: [] };

        const systemPrompt = "You are a job application assistant used for resumes. You will be given a list of bullet points and keywords. Identify the number of the best bullet point to use and which keywords to add to that bullet point in the format 0:keyword1, keyword2. Do not include the bullet point text. Find at least 1 keyword to match to a bullet point.";
        const userPrompt = `Bullet Points: ${bulletPoints.map((bp, index) => `${index}: ${bp.bullet}`).join("\n")}\nKeywords: ${missingKeywords.join(", ")}`;

        let bestBulletIndex, bestBullet, bulletContent;
        let validFormat = false;
        let count = 0;

        while (!validFormat) {
            const response = await generateAIContent(systemPrompt, userPrompt);
            const lines = response.split('\n').map(line => line.trim()).filter(Boolean);

            if (lines.length > 0 && lines[0].includes(':')) {
                const [indexStr, content] = lines[0].split(':');
                const potentialIndex = parseInt(indexStr.trim());
                if (!isNaN(potentialIndex) && potentialIndex >= 0 && potentialIndex < bulletPoints.length) {
                    bestBulletIndex = potentialIndex;
                    bulletContent = content;
                    bestBullet = bulletPoints[bestBulletIndex].bullet;
                    validFormat = true;
                } else {
                    console.log("Regenerating matches");
                }
            }
            count++;
            if (count > 50) {
                alert("An error occured, unable to match keywords to bullet points");
            }
        }

        let selectedKeywords = [];
        if (bulletContent) {
            selectedKeywords = bulletContent.split(',').map(k => k.trim());
        }
        const newBulletPoint = `${bestBullet} (${selectedKeywords.join(", ")})`;
        console.log(newBulletPoint);
        console.log(`Bullet Point Index: ${bestBulletIndex}`);
        console.log(`Original Bullet Point: ${bestBullet}`);
        console.log(`Selected Keywords: ${selectedKeywords.join(", ")}`);

        
        await autoBulletRewrite(bestBullet, selectedKeywords);
    }
    console.log("All keywords added!");
    alert("All keywords added!");
}


async function autoBulletRewrite(originalBullet, keywordsToAdd) {
    let newBulletPoint;
    let count = 0;

    do {
        let systemPrompt = "You are a job application assistant used for resumes. You will be given keywords. Your job is to take the given bullet point and rewrite it to include relevant keywords.";
        let userPrompt = `Keywords: ${keywordsToAdd.join(", ")}\nBullet Point: ${originalBullet}\n`;
        // console.log(userPrompt);
        do {
            count++;
            if (count % 5 == 0) {
                break;
            }
            console.log("generating new bullet point...");
            newBulletPoint = await generateAIContent(systemPrompt, userPrompt);

            if (newBulletPoint.length > 150) {
                const overshoot = newBulletPoint.length - 140;
                const wordsToRemove = Math.ceil(overshoot / 5);
                console.log("TOO LONG " + newBulletPoint.length);
                systemPrompt = `You are a job application assistant used for resumes. You need to rewrite this bullet point to be shorter by ${wordsToRemove} word(s)`;
            } else if (newBulletPoint.length < 130) {
                console.log("TOO SHORT " + newBulletPoint.length);
                const belowTarget = 140 - newBulletPoint.length;
                const wordsToAdd = Math.ceil(belowTarget / 5);
                systemPrompt = `You are a job application assistant used for resumes. You need to rewrite this bullet point to be longer by ${wordsToAdd} word(s)`;
            }
            // console.log(systemPrompt);
            userPrompt = `Keywords: ${keywordsToAdd.join(", ")}\nBullet Point: ${newBulletPoint}\n`;


        } while (newBulletPoint.length > 150 || newBulletPoint.length < 130);
    } while (count < 50 && (newBulletPoint.length > 150 || newBulletPoint.length < 130))
    if (newBulletPoint.length > 150 || newBulletPoint.length < 130) {
        alert("Error, please try again");
        return;
    }

    if (newBulletPoint.endsWith(".")) {
        newBulletPoint = newBulletPoint.slice(0, -1);
    }
    if (newBulletPoint.startsWith("Bullet Point: ")) {
        newBulletPoint = newBulletPoint.slice(14);
    }
    if (newBulletPoint.startsWith("- ")) {
        newBulletPoint = newBulletPoint.slice(2);
    }

    let professionalDetails = JSON.parse(localStorage.getItem("aiSelectedProfessionalDetails")) || [];

    let type;
    if (professionalDetails.some(detail => detail.bulletPoints.includes(originalBullet))) {
        type = "professional";
    } else {
        type = "experience";
    }

    let storageKey = type === "professional" ? "aiSelectedProfessionalDetails" : "aiSelectedExperienceDetails";
    let storedDetails = JSON.parse(localStorage.getItem(storageKey)) || [];

    outer:
    for (let i = 0; i < storedDetails.length; i++) {
        for (let j = 0; j < storedDetails[i].bulletPoints.length; j++) {
            if (storedDetails[i].bulletPoints[j] === originalBullet) {
                storedDetails[i].bulletPoints[j] = newBulletPoint;
                localStorage.setItem(storageKey, JSON.stringify(storedDetails));
                break outer;
            }
        }
    }
    console.log(count + " tries. Success! " + newBulletPoint);
    showAIExperiences();
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

    let systemPrompt = "You are a job application assistant used for resumes. You will be given keywords. Your job is to take the given bullet point and rewrite it to include relevant keywords. The amount of characters is required to be less than 150";
    let userPrompt = `Keywords: ${missingKeywords.join(", ")}\nBullet Point: ${bulletPoint}\n`;

    // console.log(userPrompt);
    let newBulletPoint;
    let count = 0;
    do {
        newBulletPoint = await generateAIContent(systemPrompt, userPrompt);
        console.log("generating new bullet point...");
        if (newBulletPoint.length > 150) {
            const overshoot = newBulletPoint.length - 140;
            const wordsToRemove = Math.ceil(overshoot / 5);
            console.log("TOO LONG " + newBulletPoint.length);
            systemPrompt = `You are a job application assistant used for resumes. You need to rewrite this bullet point to be shorter by ${wordsToRemove} word(s)`;
        } else if (newBulletPoint.length < 130) {
            console.log("TOO SHORT " + newBulletPoint.length);
            const belowTarget = 140 - newBulletPoint.length;
            const wordsToAdd = Math.ceil(belowTarget / 5);
            systemPrompt = `You are a job application assistant used for resumes. You need to rewrite this bullet point to be longer by ${wordsToAdd} word(s)`;
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
    if (newBulletPoint.startsWith("- ")) {
        newBulletPoint = newBulletPoint.slice(2);
    }

    detail.bulletPoints[bulletIndex] = newBulletPoint;
    localStorage.setItem(`aiSelected${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(allDetails));
    showAIExperiences();
}