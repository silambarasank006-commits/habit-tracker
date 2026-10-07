// =========================================
// HABIT TRACKER
// =========================================


// =========================================
// LOAD SAVED DATA
// =========================================

let habits =
    JSON.parse(localStorage.getItem("habits")) || [];

let habitData =
    JSON.parse(localStorage.getItem("habitData")) || {};


// =========================================
// CURRENT MONTH AND YEAR
// =========================================

const today = new Date();

let currentMonth = today.getMonth();

let currentYear = today.getFullYear();


// =========================================
// EDIT MODE
// =========================================

let editingHabitId = null;


// =========================================
// MONTH NAMES
// =========================================

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// =========================================
// GET HTML ELEMENTS
// =========================================

const currentMonthElement =
    document.querySelector(".current-month");

const currentYearElement =
    document.querySelector(".current-year");

const previousMonthButton =
    document.querySelector(".previous-month");

const nextMonthButton =
    document.querySelector(".next-month");

const previousYearButton =
    document.querySelector(".previous-year");

const nextYearButton =
    document.querySelector(".next-year");

const habitInput =
    document.querySelector(".habit-input");

const saveHabitButton =
    document.querySelector(".save-habit-button");

const habitList =
    document.querySelector(".habit-list");

const habitTable =
    document.querySelector(".habit-table");

const percentageElement =
    document.querySelector(".percentage");

const dailyPercentages =
    document.querySelector(".daily-percentages");

const treeElement =
    document.querySelector(".tree");

const treeCount =
    document.querySelector(".tree-count");

const canvas =
    document.getElementById("progressGraph");


// =========================================
// GET CURRENT MONTH KEY
// =========================================

function getMonthKey() {

    return `${currentYear}-${currentMonth + 1}`;

}


// =========================================
// GET NUMBER OF DAYS
// =========================================

function getDaysInMonth() {

    return new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

}


// =========================================
// SAVE DATA
// =========================================

function saveData() {

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );

    localStorage.setItem(
        "habitData",
        JSON.stringify(habitData)
    );

}


// =========================================
// UPDATE MONTH DISPLAY
// =========================================

function updateMonthDisplay() {

    currentMonthElement.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    currentYearElement.textContent =
        currentYear;

}


// =========================================
// ADD / UPDATE HABIT
// =========================================

function saveHabit() {

    const name =
        habitInput.value.trim();


    if (name === "") {

        habitInput.focus();

        return;

    }


    // =====================================
    // UPDATE EXISTING HABIT
    // =====================================

    if (editingHabitId !== null) {

        const habit =
            habits.find(
                function (item) {

                    return item.id ===
                        editingHabitId;

                }
            );


        if (habit) {

            habit.name = name;

        }


        editingHabitId = null;

        saveHabitButton.textContent =
            "Add";

    }


    // =====================================
    // ADD NEW HABIT
    // =====================================

    else {

        const newHabit = {

            id: Date.now(),

            name: name

        };


        habits.push(newHabit);

    }


    habitInput.value = "";

    saveData();

    renderHabits();

    renderTracker();

    updateProgress();

    drawGraph();

    habitInput.focus();

}


// =========================================
// ADD BUTTON
// =========================================

saveHabitButton.addEventListener(
    "click",
    saveHabit
);


// =========================================
// ENTER KEY
// =========================================

habitInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            saveHabit();

        }

    }
);


// =========================================
// DISPLAY HABITS
// =========================================

function renderHabits() {

    habitList.innerHTML = "";


    if (habits.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "No habits added yet.";

        message.style.padding =
            "15px";

        message.style.color =
            "#999";

        habitList.appendChild(
            message
        );

        return;

    }


    habits.forEach(
        function (habit) {

            const habitItem =
                document.createElement("div");

            habitItem.classList.add(
                "habit-item"
            );


            // HABIT NAME

            const habitName =
                document.createElement("span");

            habitName.classList.add(
                "habit-name"
            );

            habitName.textContent =
                habit.name;


            // ACTIONS

            const actions =
                document.createElement("div");

            actions.classList.add(
                "habit-actions"
            );


            // EDIT BUTTON

            const editButton =
                document.createElement("button");

            editButton.textContent =
                "✏️";

            editButton.title =
                "Edit habit";


            editButton.addEventListener(
                "click",
                function () {

                    startEditingHabit(
                        habit.id
                    );

                }
            );


            // DELETE BUTTON

            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "🗑️";

            deleteButton.title =
                "Delete habit";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteHabit(
                        habit.id
                    );

                }
            );


            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            habitItem.appendChild(
                habitName
            );

            habitItem.appendChild(
                actions
            );


            habitList.appendChild(
                habitItem
            );

        }
    );

}


// =========================================
// START EDITING HABIT
// =========================================

function startEditingHabit(id) {

    const habit =
        habits.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!habit) {

        return;

    }


    editingHabitId = id;

    habitInput.value =
        habit.name;

    saveHabitButton.textContent =
        "Update";

    habitInput.focus();

    habitInput.select();

}


// =========================================
// DELETE HABIT
// =========================================

function deleteHabit(id) {

    const habit =
        habits.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!habit) {

        return;

    }


    const shouldDelete =
        confirm(
            `Delete "${habit.name}"?`
        );


    if (!shouldDelete) {

        return;

    }


    habits =
        habits.filter(
            function (item) {

                return item.id !== id;

            }
        );


    // Remove saved completion data
    // for this habit

    Object.keys(habitData).forEach(
        function (monthKey) {

            if (
                habitData[monthKey] &&
                habitData[monthKey][id]
            ) {

                delete habitData[
                    monthKey
                ][id];

            }

        }
    );


    if (editingHabitId === id) {

        editingHabitId = null;

        habitInput.value = "";

        saveHabitButton.textContent =
            "Add";

    }


    saveData();

    renderHabits();

    renderTracker();

    updateProgress();

    drawGraph();

}


// =========================================
// CHECK IF HABIT IS COMPLETED
// =========================================

function isCompleted(
    habitId,
    day
) {

    const monthKey =
        getMonthKey();


    if (!habitData[monthKey]) {

        return false;

    }


    if (!habitData[monthKey][habitId]) {

        return false;

    }


    return (
        habitData[monthKey][habitId][day]
        === true
    );

}


// =========================================
// SAVE CHECKBOX STATUS
// =========================================

function saveHabitStatus(
    habitId,
    day,
    checked
) {

    const monthKey =
        getMonthKey();


    if (!habitData[monthKey]) {

        habitData[monthKey] = {};

    }


    if (!habitData[monthKey][habitId]) {

        habitData[monthKey][habitId] = {};

    }


    habitData[monthKey][habitId][day] =
        checked;


    saveData();

}


// =========================================
// CREATE DAILY TRACKER
// =========================================

function renderTracker() {

    const tableHead =
        habitTable.querySelector(
            "thead tr"
        );

    const tableBody =
        habitTable.querySelector(
            "tbody"
        );


    tableHead.innerHTML = "";

    tableBody.innerHTML = "";


    // =====================================
    // HABIT HEADER
    // =====================================

    const habitHeader =
        document.createElement("th");

    habitHeader.textContent =
        "Habit";

    tableHead.appendChild(
        habitHeader
    );


    const days =
        getDaysInMonth();


    // =====================================
    // CREATE DAY HEADERS
    // =====================================

    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const date =
            new Date(
                currentYear,
                currentMonth,
                day
            );


        const weekday =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );


        const th =
            document.createElement("th");


        th.innerHTML = `
            <div>${weekday}</div>
            <div>${day}</div>
        `;


        tableHead.appendChild(
            th
        );

    }


    // =====================================
    // CREATE HABIT ROWS
    // =====================================

    habits.forEach(
        function (habit) {

            const row =
                document.createElement("tr");


            const nameCell =
                document.createElement("td");


            nameCell.textContent =
                habit.name;


            row.appendChild(
                nameCell
            );


            // CREATE CHECKBOX
            // FOR EACH DAY

            for (
                let day = 1;
                day <= days;
                day++
            ) {

                const cell =
                    document.createElement("td");


                const checkbox =
                    document.createElement(
                        "input"
                    );


                checkbox.type =
                    "checkbox";


                checkbox.checked =
                    isCompleted(
                        habit.id,
                        day
                    );


                checkbox.addEventListener(
                    "change",
                    function () {

                        saveHabitStatus(
                            habit.id,
                            day,
                            checkbox.checked
                        );


                        updateProgress();

                        drawGraph();

                    }
                );


                cell.appendChild(
                    checkbox
                );


                row.appendChild(
                    cell
                );

            }


            tableBody.appendChild(
                row
            );

        }
    );

}


// =========================================
// GET DAILY COMPLETION PERCENTAGE
// =========================================

function getDailyPercentage(day) {

    if (habits.length === 0) {

        return 0;

    }


    let completed = 0;


    habits.forEach(
        function (habit) {

            if (
                isCompleted(
                    habit.id,
                    day
                )
            ) {

                completed++;

            }

        }
    );


    return Math.round(
        (completed / habits.length) * 100
    );

}


// =========================================
// GET NUMBER OF COMPLETED HABITS
// =========================================

function getCompletedHabits(day) {

    let completed = 0;


    habits.forEach(
        function (habit) {

            if (
                isCompleted(
                    habit.id,
                    day
                )
            ) {

                completed++;

            }

        }
    );


    return completed;

}


// =========================================
// GET CHERRY TREE STAGE
// =========================================

function getTreeStage(day) {

    if (habits.length === 0) {

        return 0;

    }


    const completed =
        getCompletedHabits(day);


    const percentage =
        (completed / habits.length) * 100;


    // No habits completed

    if (percentage === 0) {

        return 0;

    }


    // Small tree

    if (percentage <= 25) {

        return 1;

    }


    // Growing tree

    if (percentage <= 50) {

        return 2;

    }


    // Some blossoms

    if (percentage <= 75) {

        return 3;

    }


    // Almost full

    if (percentage < 100) {

        return 4;

    }


    // Fully bloomed

    return 5;

}


// =========================================
// CHERRY BLOSSOM TREE SVG
// =========================================

function createCherryTree(stage) {

    // =====================================
    // STAGE 0
    // SEED / SMALL SPROUT
    // =====================================

    if (stage === 0) {

        return `
        <svg viewBox="0 0 100 100"
             class="tree-stage">

            <ellipse
                cx="50"
                cy="88"
                rx="18"
                ry="5"
                fill="#d8a08c"
            />

            <path
                d="M50 85
                   C48 75 48 68 50 58"
                stroke="#79a83f"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
            />

            <path
                d="M49 70
                   C42 65 39 60 40 55"
                stroke="#79a83f"
                stroke-width="3"
                fill="none"
            />

            <path
                d="M51 68
                   C58 63 61 58 60 54"
                stroke="#79a83f"
                stroke-width="3"
                fill="none"
            />

            <ellipse
                cx="41"
                cy="55"
                rx="7"
                ry="4"
                fill="#9acb4b"
                transform="rotate(-25 41 55)"
            />

            <ellipse
                cx="59"
                cy="54"
                rx="7"
                ry="4"
                fill="#9acb4b"
                transform="rotate(25 59 54)"
            />

        </svg>
        `;
    }


    // =====================================
    // STAGE 1
    // SMALL TREE
    // =====================================

    if (stage === 1) {

        return `
        <svg viewBox="0 0 100 100"
             class="tree-stage">

            <ellipse
                cx="50"
                cy="91"
                rx="22"
                ry="5"
                fill="#d8a08c"
            />

            <path
                d="M50 89
                   C48 73 48 57 50 40"
                stroke="#79503b"
                stroke-width="7"
                fill="none"
                stroke-linecap="round"
            />

            <path
                d="M49 63
                   C39 55 34 46 34 37"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
            />

            <path
                d="M51 61
                   C61 53 66 44 66 35"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"
            />

            <circle
                cx="34"
                cy="34"
                r="9"
                fill="#9acb4b"
            />

            <circle
                cx="66"
                cy="32"
                r="9"
                fill="#9acb4b"
            />

            <circle
                cx="50"
                cy="25"
                r="10"
                fill="#9acb4b"
            />

        </svg>
        `;
    }


    // =====================================
    // STAGE 2
    // GROWING TREE
    // =====================================

    if (stage === 2) {

        return `
        <svg viewBox="0 0 100 100"
             class="tree-stage">

            <ellipse
                cx="50"
                cy="92"
                rx="25"
                ry="5"
                fill="#d8a08c"
            />

            <path
                d="M50 90
                   C48 72 49 55 50 30"
                stroke="#79503b"
                stroke-width="8"
                fill="none"
                stroke-linecap="round"
            />

            <path
                d="M49 67
                   C35 58 29 49 27 38"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
            />

            <path
                d="M51 65
                   C65 55 72 46 75 35"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
            />

            <path
                d="M50 51
                   C43 43 39 36 39 27"
                stroke="#79503b"
                stroke-width="3"
                fill="none"
            />

            <circle
                cx="27"
                cy="35"
                r="10"
                fill="#8fbd45"
            />

            <circle
                cx="74"
                cy="32"
                r="11"
                fill="#8fbd45"
            />

            <circle
                cx="40"
                cy="25"
                r="9"
                fill="#9acb4b"
            />

            <circle
                cx="60"
                cy="25"
                r="10"
                fill="#9acb4b"
            />

            <circle
                cx="50"
                cy="17"
                r="9"
                fill="#9acb4b"
            />

        </svg>
        `;
    }


    // =====================================
    // STAGE 3
    // SOME CHERRY BLOSSOMS
    // =====================================

    if (stage === 3) {

        return `
        <svg viewBox="0 0 100 100"
             class="tree-stage">

            <ellipse
                cx="50"
                cy="93"
                rx="27"
                ry="5"
                fill="#d8a08c"
            />

            <path
                d="M50 91
                   C47 70 49 48 50 27"
                stroke="#79503b"
                stroke-width="8"
                fill="none"
                stroke-linecap="round"
            />

            <path
                d="M49 66
                   C35 57 27 47 25 35"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
            />

            <path
                d="M51 64
                   C67 54 75 43 77 31"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
            />

            <path
                d="M50 49
                   C42 40 37 32 36 22"
                stroke="#79503b"
                stroke-width="3"
                fill="none"
            />

            <path
                d="M51 48
                   C59 39 64 31 65 20"
                stroke="#79503b"
                stroke-width="3"
                fill="none"
            />

            <!-- BLOSSOMS -->

            <circle
                cx="25"
                cy="32"
                r="9"
                fill="#f6b5ca"
            />

            <circle
                cx="77"
                cy="28"
                r="10"
                fill="#f6b5ca"
            />

            <circle
                cx="36"
                cy="21"
                r="9"
                fill="#f8c1d4"
            />

            <circle
                cx="65"
                cy="19"
                r="9"
                fill="#f8c1d4"
            />

            <circle
                cx="50"
                cy="14"
                r="10"
                fill="#f6b5ca"
            />

            <!-- FLOWER CENTERS -->

            <circle
                cx="25"
                cy="32"
                r="3"
                fill="#e79ab6"
            />

            <circle
                cx="77"
                cy="28"
                r="3"
                fill="#e79ab6"
            />

            <circle
                cx="36"
                cy="21"
                r="3"
                fill="#e79ab6"
            />

            <circle
                cx="65"
                cy="19"
                r="3"
                fill="#e79ab6"
            />

            <circle
                cx="50"
                cy="14"
                r="3"
                fill="#e79ab6"
            />

        </svg>
        `;
    }


    // =====================================
    // STAGE 4
    // ALMOST FULL BLOOM
    // =====================================

    if (stage === 4) {

        return `
        <svg viewBox="0 0 100 100"
             class="tree-stage">

            <ellipse
                cx="50"
                cy="94"
                rx="29"
                ry="5"
                fill="#d8a08c"
            />

            <path
                d="M50 92
                   C46 68 49 45 50 24"
                stroke="#79503b"
                stroke-width="9"
                fill="none"
                stroke-linecap="round"
            />

            <path
                d="M49 65
                   C34 54 24 43 22 30"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
            />

            <path
                d="M51 63
                   C67 53 77 41 80 28"
                stroke="#79503b"
                stroke-width="4"
                fill="none"
            />

            <path
                d="M50 48
                   C39 39 34 27 33 17"
                stroke="#79503b"
                stroke-width="3"
                fill="none"
            />

            <path
                d="M51 47
                   C62 37 67 27 68 15"
                stroke="#79503b"
                stroke-width="3"
                fill="none"
            />

            <!-- BLOSSOMS -->

            <circle cx="21" cy="28" r="12" fill="#f6aec6"/>
            <circle cx="80" cy="26" r="12" fill="#f6aec6"/>
            <circle cx="33" cy="17" r="11" fill="#f8bfd2"/>
            <circle cx="68" cy="15" r="11" fill="#f8bfd2"/>
            <circle cx="50" cy="11" r="12" fill="#f6aec6"/>
            <circle cx="40" cy="30" r="10" fill="#f8bfd2"/>
            <circle cx="62" cy="28" r="10" fill="#f8bfd2"/>

            <!-- CENTERS -->

            <circle cx="21" cy="28" r="3" fill="#e58eaa"/>
            <circle cx="80" cy="26" r="3" fill="#e58eaa"/>
            <circle cx="33" cy="17" r="3" fill="#e58eaa"/>
            <circle cx="68" cy="15" r="3" fill="#e58eaa"/>
            <circle cx="50" cy="11" r="3" fill="#e58eaa"/>

        </svg>
        `;
    }


    // =====================================
    // STAGE 5
    // FULL CHERRY BLOSSOM
    // =====================================

    return `
    <svg viewBox="0 0 100 100"
         class="tree-stage">

        <ellipse
            cx="50"
            cy="94"
            rx="31"
            ry="5"
            fill="#d8a08c"
        />

        <path
            d="M50 92
               C45 67 49 42 50 22"
            stroke="#79503b"
            stroke-width="9"
            fill="none"
            stroke-linecap="round"
        />

        <path
            d="M49 67
               C33 55 22 42 19 27"
            stroke="#79503b"
            stroke-width="4"
            fill="none"
        />

        <path
            d="M51 66
               C68 54 79 41 82 25"
            stroke="#79503b"
            stroke-width="4"
            fill="none"
        />

        <path
            d="M50 48
               C38 38 31 26 31 14"
            stroke="#79503b"
            stroke-width="3"
            fill="none"
        />

        <path
            d="M51 47
               C63 37 69 25 69 12"
            stroke="#79503b"
            stroke-width="3"
            fill="none"
        />


        <!-- MANY BLOSSOMS -->

        <circle cx="19" cy="27" r="12" fill="#f5a8c2"/>
        <circle cx="82" cy="25" r="12" fill="#f5a8c2"/>

        <circle cx="31" cy="14" r="11" fill="#f8bfd2"/>
        <circle cx="69" cy="12" r="11" fill="#f8bfd2"/>

        <circle cx="50" cy="10" r="13" fill="#f6aec6"/>

        <circle cx="34" cy="31" r="11" fill="#f8bfd2"/>
        <circle cx="66" cy="29" r="11" fill="#f8bfd2"/>

        <circle cx="28" cy="45" r="9" fill="#f6aec6"/>
        <circle cx="73" cy="43" r="9" fill="#f6aec6"/>

        <circle cx="43" cy="22" r="10" fill="#f6aec6"/>
        <circle cx="57" cy="21" r="10" fill="#f6aec6"/>

        <!-- CENTERS -->

        <circle cx="19" cy="27" r="3" fill="#e58eaa"/>
        <circle cx="82" cy="25" r="3" fill="#e58eaa"/>
        <circle cx="31" cy="14" r="3" fill="#e58eaa"/>
        <circle cx="69" cy="12" r="3" fill="#e58eaa"/>
        <circle cx="50" cy="10" r="3" fill="#e58eaa"/>
        <circle cx="34" cy="31" r="3" fill="#e58eaa"/>
        <circle cx="66" cy="29" r="3" fill="#e58eaa"/>

    </svg>
    `;

}


// =========================================
// RENDER DAILY CHERRY TREES
// =========================================

function renderDailyTrees() {

    dailyPercentages.innerHTML = "";


    const days =
        getDaysInMonth();


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        // Create box

        const treeBox =
            document.createElement("div");


        treeBox.classList.add(
            "daily-tree"
        );


        // Create tree area

        const treeIcon =
            document.createElement("div");


        treeIcon.classList.add(
            "daily-tree-icon"
        );


        // Get stage

        const stage =
            getTreeStage(day);


        // Add tree

        treeIcon.innerHTML =
            createCherryTree(stage);


        // Day number

        const dayText =
            document.createElement("div");


        dayText.classList.add(
            "daily-tree-day"
        );


        dayText.textContent =
            day;


        // Add everything

        treeBox.appendChild(
            treeIcon
        );

        treeBox.appendChild(
            dayText
        );


        dailyPercentages.appendChild(
            treeBox
        );

    }

}


// =========================================
// UPDATE OVERALL PROGRESS
// =========================================

function updateProgress() {

    const days =
        getDaysInMonth();


    const totalPossible =
        habits.length * days;


    let totalCompleted = 0;


    habits.forEach(
        function (habit) {

            for (
                let day = 1;
                day <= days;
                day++
            ) {

                if (
                    isCompleted(
                        habit.id,
                        day
                    )
                ) {

                    totalCompleted++;

                }

            }

        }
    );


    let percentage = 0;


    if (totalPossible > 0) {

        percentage =
            Math.round(
                (totalCompleted /
                    totalPossible) * 100
            );

    }


    // Overall percentage

    percentageElement.textContent =
        `${percentage}%`;


    // Daily cherry trees

    renderDailyTrees();


    // Main tree

    updateMainTree(percentage);

}


// =========================================
// MAIN MONTH TREE
// =========================================

function updateMainTree(percentage) {

    if (percentage === 0) {

        treeElement.textContent =
            "🌱";

        treeCount.textContent =
            "Start Growing";

    }

    else if (percentage < 25) {

        treeElement.textContent =
            "🌿";

        treeCount.textContent =
            "Your tree is growing";

    }

    else if (percentage < 50) {

        treeElement.textContent =
            "🌳";

        treeCount.textContent =
            "Growing stronger";

    }

    else if (percentage < 75) {

        treeElement.textContent =
            "🌸";

        treeCount.textContent =
            "Starting to bloom";

    }

    else if (percentage < 100) {

        treeElement.textContent =
            "🌸🌸";

        treeCount.textContent =
            "Almost fully bloomed";

    }

    else {

        treeElement.textContent =
            "🌸🌸🌸";

        treeCount.textContent =
            "Fully bloomed!";

    }

}


// =========================================
// PREVIOUS MONTH
// =========================================

previousMonthButton.addEventListener(
    "click",
    function () {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

        }


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// NEXT MONTH
// =========================================

nextMonthButton.addEventListener(
    "click",
    function () {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

        }


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// PREVIOUS YEAR
// =========================================

previousYearButton.addEventListener(
    "click",
    function () {

        currentYear--;


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// NEXT YEAR
// =========================================

nextYearButton.addEventListener(
    "click",
    function () {

        currentYear++;


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// DRAW PROGRESS GRAPH
// =========================================

function drawGraph() {

    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    canvas.width =
        width;

    canvas.height =
        height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const left = 40;

    const right = 15;

    const top = 15;

    const bottom = 30;


    const graphWidth =
        width - left - right;


    const graphHeight =
        height - top - bottom;


    // =====================================
    // GRID LINES
    // =====================================

    ctx.strokeStyle =
        "#f0dce6";

    ctx.lineWidth = 1;


    for (
        let value = 0;
        value <= 100;
        value += 25
    ) {

        const y =
            top +
            graphHeight -
            (value / 100) *
            graphHeight;


        ctx.beginPath();

        ctx.moveTo(
            left,
            y
        );

        ctx.lineTo(
            width - right,
            y
        );

        ctx.stroke();


        ctx.fillStyle =
            "#999";

        ctx.font =
            "11px Arial";

        ctx.textAlign =
            "right";


        ctx.fillText(
            `${value}%`,
            left - 7,
            y + 4
        );

    }


    // =====================================
    // NO HABITS
    // =====================================

    if (habits.length === 0) {

        ctx.fillStyle =
            "#aaa";

        ctx.font =
            "15px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            "Add habits to see your progress",
            width / 2,
            height / 2
        );

        return;

    }


    // =====================================
    // GET DAILY VALUES
    // =====================================

    const days =
        getDaysInMonth();


    const values = [];


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        values.push(
            getDailyPercentage(day)
        );

    }


    // =====================================
    // DRAW LINE
    // =====================================

    ctx.beginPath();


    values.forEach(
        function (value, index) {

            const x =
                left +
                (index / (days - 1)) *
                graphWidth;


            const y =
                top +
                graphHeight -
                (value / 100) *
                graphHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            }

            else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#d86b9d";

    ctx.lineWidth = 3;

    ctx.stroke();


    // =====================================
    // DRAW POINTS
    // =====================================

    values.forEach(
        function (value, index) {

            const x =
                left +
                (index / (days - 1)) *
                graphWidth;


            const y =
                top +
                graphHeight -
                (value / 100) *
                graphHeight;


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                3,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#d86b9d";

            ctx.fill();

        }
    );


    // =====================================
    // DAY NUMBERS
    // =====================================

    ctx.fillStyle =
        "#999";

    ctx.font =
        "10px Arial";

    ctx.textAlign =
        "center";


    values.forEach(
        function (value, index) {

            const day =
                index + 1;


            if (
                day === 1 ||
                day % 5 === 0 ||
                day === days
            ) {

                const x =
                    left +
                    (index / (days - 1)) *
                    graphWidth;


                ctx.fillText(
                    day,
                    x,
                    height - 8
                );

            }

        }
    );

}


// =========================================
// WINDOW RESIZE
// =========================================

window.addEventListener(
    "resize",
    function () {

        drawGraph();

    }
);


// =========================================
// INITIAL LOAD
// =========================================

updateMonthDisplay();

renderHabits();

renderTracker();

updateProgress();

drawGraph();