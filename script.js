$(document).ready(function () {
    const dictionary = [
        { word: "always", translations: ["завжди"] },
        { word: "never", translations: ["ніколи"] },
        { word: "sometimes", translations: ["іноді", "інколи"] },
        { word: "often", translations: ["часто"] },
        { word: "luminescence", translations: ["світіння"] },
        { word: "usually", translations: ["зазвичай"] },
        { word: "today", translations: ["сьогодні"] },
        { word: "tomorrow", translations: ["завтра"] },
        { word: "bloom", translations: ["розквітати", "цвітіння"] },
        { word: "together", translations: ["разом"] }
    ];
    let words = [];
    let currentIndex = 0;
    let userAnswers = [];

    function shuffle(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function initApp() {
        words = shuffle(dictionary);
        currentIndex = 0;
        userAnswers = new Array(words.length).fill(null);

        $("#resultModal").css("display", "none");
        renderCurrentCard();
    }
    function renderCurrentCard() {
        const current = words[currentIndex];
        $("#cardFlipper").removeClass("is-flipped");
        $("#foreignWord").text(current.word);
        $("#backTranslation").text(current.translations.join(", "));
        const stepStr = `${currentIndex + 1} / ${words.length}`;
        $("#stepCounter").text(stepStr);
        $("#navStep").text(stepStr);
        const progressPercent = ((currentIndex + 1) / words.length) * 100;
        $("#progressBar").css("width", `${progressPercent}%`);
        $("#translationInput")
            .val("")
            .removeClass("input-error input-success")
            .prop("disabled", false);
        $("#feedbackMsg").text("").removeClass("correct incorrect");
        $("#prevBtn").prop("disabled", currentIndex === 0);
        $("#nextBtn").prop("disabled", currentIndex === words.length - 1);
        updateStats();
    }
    function updateStats() {
        const correct = userAnswers.filter(a => a === true).length;
        const incorrect = userAnswers.filter(a => a === false).length;
        $("#correctCount").text(correct);
        $("#incorrectCount").text(incorrect);
    }
    function normalize(str) {
        return str.trim().toLowerCase().replace(/ґ/g, "г");
    }
    function checkInputAnswer() {
        const inputVal = $("#translationInput").val();
        if (!inputVal.trim()) {
            $("#translationInput").addClass("input-error").focus();
            return;
        }
        const normalizedInput = normalize(inputVal);
        const validTranslations = words[currentIndex].translations.map(t => normalize(t));
        const isCorrect = validTranslations.includes(normalizedInput);
        if (isCorrect) {
            $("#translationInput").removeClass("input-error").addClass("input-success");
            $("#feedbackMsg").text("✓ Вірно!").addClass("correct").removeClass("incorrect");
            userAnswers[currentIndex] = true;
        } else {
            $("#translationInput").removeClass("input-success").addClass("input-error");
            $("#feedbackMsg")
                .text(`✕ Невірно. Правильно: ${words[currentIndex].translations[0]}`)
                .addClass("incorrect")
                .removeClass("correct");
            userAnswers[currentIndex] = false;
        }
        updateStats();
        setTimeout(() => {
            if (userAnswers.every(ans => ans !== null)) {
                showModalResults();
            } else if (currentIndex < words.length - 1) {
                currentIndex++;
                renderCurrentCard();
            }
        }, 1000);
    }
    function markCard(isKnown) {
        userAnswers[currentIndex] = isKnown;
        updateStats();
        if (isKnown) {
            $("#feedbackMsg").text("Зараховано як 'Знаю'").addClass("correct").removeClass("incorrect");
        } else {
            $("#feedbackMsg").text("Позначено для повторення").addClass("incorrect").removeClass("correct");
        }
        setTimeout(() => {
            if (userAnswers.every(ans => ans !== null)) {
                showModalResults();
            } else if (currentIndex < words.length - 1) {
                currentIndex++;
                renderCurrentCard();
            }
        }, 600);
    }
    function showModalResults() {
        const correct = userAnswers.filter(a => a === true).length;
        const total = words.length;
        const pct = Math.round((correct / total) * 100);
        $("#scorePercent").text(`${pct}%`);
        $("#modalStatsText").text(`Ви відповіли правильно на ${correct} з ${total} слів.`);
        let badge = "";
        if (pct >= 90) badge = "🏆 Відмінно! Модуль засвоєно";
        else if (pct >= 70) badge = "👍 Добре! Майже все знаєте";
        else if (pct >= 50) badge = "😐 Непогано, але варто повторити";
        else badge = "💪 Потрібно більше практики";

        $("#modalLevelBadge").text(badge);
        $("#resultModal").css("display", "flex");
    }
    $("#cardFlipper").on("click", function () {
    $(this).toggleClass("is-flipped");
    if (userAnswers[currentIndex] === null) {
        checkInputAnswer();
    }
        });
    $("#translationInput").on("keypress", function (e) {
        if (e.which === 13) {
            checkInputAnswer();
        }
    });
    $("#checkBtn").on("click", checkInputAnswer);
    $("#markIncorrectBtn").on("click", function () { markCard(false); });
    $("#markCorrectBtn").on("click", function () { markCard(true); });
    $("#prevBtn").on("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            renderCurrentCard();
        }
    });

    $("#nextBtn").on("click", function () {
        if (currentIndex < words.length - 1) {
            currentIndex++;
            renderCurrentCard();
        }
    });
    $("#restartBtn").on("click", initApp);
    initApp();
});