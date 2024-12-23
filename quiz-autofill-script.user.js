// ==UserScript==
// @name         Cnull Script - RGPD Quiz AutoFill
// @namespace    https://github.com/Pixnop/Cnull
// @version      1.0
// @description  Automatise le remplissage des questionnaires du cours RGPD de la CNIL avec support multi-modules et auto-navigation
// @author       Léon Fievet
// @match        https://atelier-rgpd.cnil.fr/mod/quiz/*
// @icon         https://raw.githubusercontent.com/Pixnop/Cnull/main/logo/CNULL.png
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // Configuration des modules
    const QUIZ_MODULES = {};

    // Styles CSS
    GM_addStyle(`
        .quiz-control-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            min-width: 250px;
        }
        .quiz-control-panel h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
            color: #333;
        }
        .quiz-control-panel button {
            margin: 5px 0;
            padding: 8px 15px;
            width: 100%;
            cursor: pointer;
        }
        .module-info {
            font-size: 12px;
            margin-bottom: 10px;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .debug-info {
            font-size: 11px;
            color: #666;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .controls-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .checkbox-container {
            display: flex;
            align-items: center;
            padding: 5px;
            background: #f8f8f8;
            border-radius: 4px;
            flex-shrink: 0;
        }
        .auto-next-checkbox {
            margin-right: 8px;
        }
        .checkbox-container label {
            font-size: 12px;
            color: #666;
            user-select: none;
            cursor: pointer;
        }
    `);

    function log(...args) {
        console.log('[RGPD Quiz]', ...args);
    }

    function saveAutoNextState(state) {
    localStorage.setItem('rgpdQuizAutoNext', state);
    }

    function getAutoNextState() {
        return localStorage.getItem('rgpdQuizAutoNext') === 'true';
    }

    function triggerEvent(element, eventType) {
        const event = document.createEvent('HTMLEvents');
        event.initEvent(eventType, true, false);
        element.dispatchEvent(event);
    }

    function detectCurrentModule() {
        const pageContent = [
            ...Array.from(document.querySelectorAll('h1, h2, .page-header-headings')).map(el => el.textContent),
            ...Array.from(document.querySelectorAll('.breadcrumb li')).map(el => el.textContent),
        ].join(' ').toUpperCase();

        log('Page content:', pageContent);

        for (const [moduleId, moduleData] of Object.entries(QUIZ_MODULES)) {
            for (const identifier of moduleData.moduleIdentifiers) {
                if (pageContent.includes(identifier.toUpperCase())) {
                    log('Module found:', moduleId, 'via identifier:', identifier);
                    return moduleId;
                }
            }
        }
        return null;
    }

    function findQuestionByTitle(questions, title) {
    // Nettoyer le titre de la question actuelle
    const cleanTitle = title.replace(/\s+/g, ' ')  // Normaliser les espaces
                           .replace(/[?!.,;:«»"*]/g, '') // Enlever la ponctuation
                           .replace(/&nbsp;/g, ' ')  // Remplacer les &nbsp;
                           .replace(/^[0-9]+\.\s*/, '') // Enlever les numéros au début
                           .replace(/\s*:\s*$/, '')  // Enlever les deux points à la fin
                           .toLowerCase()
                           .trim();

    log('Looking for question:', cleanTitle);

    const question = questions.find(q => {
        // Nettoyer le titre de la question dans la base
        const cleanQTitle = q.title.replace(/\s+/g, ' ')
                                 .replace(/[?!.,;:«»"*]/g, '')
                                 .replace(/&nbsp;/g, ' ')
                                 .replace(/^[0-9]+\.\s*/, '')
                                 .replace(/\s*:\s*$/, '')
                                 .toLowerCase()
                                 .trim();

        // Vérifier si les titres correspondent de manière souple
        const match = cleanQTitle === cleanTitle ||
                     cleanTitle.includes(cleanQTitle) ||
                     cleanQTitle.includes(cleanTitle) ||
                     // Comparer les mots significatifs
                     (cleanTitle.split(' ')
                              .filter(word => word.length > 3 && !['dans', 'pour', 'avec', 'les'].includes(word))
                              .every(word => cleanQTitle.includes(word)));

        if (match) {
            log('Question match found:', {original: q.title, cleaned: cleanQTitle});
        }
        return match;
    });

    return question;
}

    function handleMatchQuestion(questionDiv, answers) {
        log('Handling match question');

        // Vérifier si c'est une question d'appariement avec des selects
        const selects = questionDiv.querySelectorAll('select');
        if (selects.length > 0) {
            // Code existant pour les selects
            selects.forEach(select => {
                const questionText = select.closest('tr').querySelector('.text')?.textContent.trim();
                log('Looking for answer for:', questionText);

                const answer = answers.find(a => {
                    const cleanText = questionText.replace(/\s+/g, ' ').trim();
                    return cleanText.includes(a.text) || a.text.includes(cleanText);
                });

                if (answer) {
                    log('Found answer match:', answer.match);
                    const options = Array.from(select.options);
                    const correctOption = options.find(opt =>
                        opt.text.trim() === answer.match.trim()
                    );
                    if (correctOption) {
                        select.value = correctOption.value;
                        triggerEvent(select, 'change');
                    }
                }
            });
        } else {
            // Si pas de selects, traiter comme une question à choix multiple
            handleMultiChoiceQuestion(questionDiv, answers);
        }
    }

    function cleanAnswerText(text) {
        return text.replace(/\s+/g, ' ')
                  .replace(/[?!.,;:«»"*]/g, '')
                  .replace(/^[0-9]+\.\s*/, '')
                  .replace(/\s*:\s*$/, '')
                  .toLowerCase()
                  .trim();
    }

    function answersMatch(text1, text2) {
        const clean1 = cleanAnswerText(text1);
        const clean2 = cleanAnswerText(text2);
        return clean1 === clean2 ||
               clean1.includes(clean2) ||
               clean2.includes(clean1);
    }

    function handleMultiChoiceQuestion(questionDiv, answers) {
        log('Handling multichoice question');

        // Détecte le type réel d'input dans le DOM
        const hasCheckboxes = questionDiv.querySelector('input[type="checkbox"]') !== null;
        const hasRadios = questionDiv.querySelector('input[type="radio"]') !== null;

        log(`Input types detected - Checkboxes: ${hasCheckboxes}, Radio buttons: ${hasRadios}`);

        // Compte les réponses correctes pour validation
        const correctAnswersCount = answers.filter(a => a.correct).length;
        log(`Number of correct answers: ${correctAnswersCount}`);

        if (hasRadios) {
        // Gérer comme des radio buttons
        log('Handling as radio buttons');
        const choices = questionDiv.querySelectorAll('input[type="radio"]');
        choices.forEach(radio => {
            const label = radio.closest('.d-flex')?.querySelector('.flex-fill')?.textContent.trim() ||
                         radio.nextElementSibling?.textContent.trim();

            if (!label) return;

            log('Checking radio option:', label);
            const answer = answers.find(a => answersMatch(label, a.text));

            if (answer?.correct) {
                log('Found correct radio answer:', label);
                setTimeout(() => {
                    radio.checked = true;
                    triggerEvent(radio, 'change');
                    triggerEvent(radio, 'input');
                }, 100);
            }
        });
    } else if (hasCheckboxes) {
            // Gérer comme des checkboxes
            log('Handling as checkboxes');
            const choices = questionDiv.querySelectorAll('.answer > div');
            choices.forEach(choice => {
                const answerText = choice.querySelector('.flex-fill')?.textContent.trim();
                if (!answerText) return;

                log('Checking checkbox option:', answerText);
                const answer = answers.find(a => {
                    const cleanLabel = answerText.replace(/\s+/g, ' ').trim().toLowerCase();
                    const cleanAnswer = a.text.replace(/\s+/g, ' ').trim().toLowerCase();
                    return cleanLabel === cleanAnswer ||
                        cleanLabel.includes(cleanAnswer) ||
                        cleanAnswer.includes(cleanLabel);
                });

                if (answer) {
                    const hiddenInput = choice.querySelector('input[type="hidden"]');
                    const checkbox = choice.querySelector('input[type="checkbox"]');

                    if (hiddenInput && checkbox) {
                        setTimeout(() => {
                            hiddenInput.value = answer.correct ? "1" : "0";
                            checkbox.checked = answer.correct;
                            triggerEvent(checkbox, 'change');
                            triggerEvent(checkbox, 'input');
                        }, 100);
                    }
                }
            });
        }
    }

    function handleTrueFalseQuestion(questionDiv, answers) {
        log('Handling true/false question');
        const inputs = questionDiv.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            const label = input.nextElementSibling?.textContent.trim();
            if (label) {
                log('Checking answer:', label);
                const answer = answers.find(a => a.text.trim() === label);
                if (answer?.correct) {
                    setTimeout(() => {
                        input.checked = true;
                        triggerEvent(input, 'change');
                        triggerEvent(input, 'input');
                    }, 100);
                }
            }
        });
    }

    function autoFillQuestions(moduleId = null, autoNext = false) {
        log('Starting auto-fill process');
        if (!moduleId) {
            moduleId = detectCurrentModule();
        }

        if (!moduleId || !QUIZ_MODULES[moduleId]) {
            alert('Module non reconnu ! Vérifiez la console pour plus de détails.');
            return;
        }

        const questions = QUIZ_MODULES[moduleId].questions.questions;
        log('Found questions for module:', questions.length);

        const questionDivs = document.querySelectorAll('div[id^="question-"]');
        log('Found question divs on page:', questionDivs.length);

        questionDivs.forEach((questionDiv, index) => {
            log(`Processing question div ${index + 1}`);
            const titleElement = questionDiv.querySelector('.qtext');
            if (!titleElement) {
                log('No title element found for question');
                return;
            }

            const title = titleElement.textContent.trim();
            log('Question title:', title);
            const question = findQuestionByTitle(questions, title);

            if (!question) {
                log('No matching question found in answers');
                return;
            }

            setTimeout(() => {
                log('Question type:', question.type);
                if (questionDiv.classList.contains('match')) {
                    handleMatchQuestion(questionDiv, question.answers);
                } else if (questionDiv.classList.contains('multichoice')) {
                    handleMultiChoiceQuestion(questionDiv, question.answers);
                } else if (questionDiv.classList.contains('truefalse')) {
                    handleTrueFalseQuestion(questionDiv, question.answers);
                }

                // Si c'est la dernière question et autoNext est activé
                if (index === questionDivs.length - 1 && autoNext) {
                    setTimeout(() => {
                        const nextButton = document.querySelector('.mod_quiz-next-nav');
                        if (nextButton) {
                            log('Auto-navigating to next page...');
                            nextButton.click();
                        }
                    }, 500);
                }
            }, index * 200);
        });
    }

    function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'quiz-control-panel';

    const title = document.createElement('h3');
    title.textContent = 'Auto-remplissage Quiz RGPD';
    panel.appendChild(title);

    const currentModule = detectCurrentModule();
    const moduleInfo = document.createElement('div');
    moduleInfo.className = 'module-info';
    moduleInfo.textContent = currentModule ?
        `Module détecté : Module ${currentModule.replace('module', '')}` :
        'Module non reconnu';
    panel.appendChild(moduleInfo);

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';

    const fillButton = document.createElement('button');
    fillButton.className = 'btn btn-primary';
    fillButton.textContent = 'Remplir les réponses';
    fillButton.disabled = !currentModule;
    controlsContainer.appendChild(fillButton);

    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';

    const autoNextCheckbox = document.createElement('input');
    autoNextCheckbox.type = 'checkbox';
    autoNextCheckbox.id = 'autoNextCheckbox';
    autoNextCheckbox.className = 'auto-next-checkbox';
    // Restaurer l'état précédent
    autoNextCheckbox.checked = getAutoNextState();

    const checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = 'autoNextCheckbox';
    checkboxLabel.textContent = 'Auto';

    // Sauvegarder l'état quand la case est cochée/décochée
    autoNextCheckbox.addEventListener('change', () => {
        saveAutoNextState(autoNextCheckbox.checked);
    });

    checkboxContainer.appendChild(autoNextCheckbox);
    checkboxContainer.appendChild(checkboxLabel);
    controlsContainer.appendChild(checkboxContainer);

    fillButton.onclick = () => autoFillQuestions(currentModule, autoNextCheckbox.checked);

    panel.appendChild(controlsContainer);

    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    debugInfo.textContent = `État: ${currentModule ? 'Module trouvé' : 'Module non trouvé'}\nVérifiez la console pour plus de détails`;
    panel.appendChild(debugInfo);

    document.body.appendChild(panel);
}

    window.addEventListener('load', () => {
        createControlPanel();
    });
})();