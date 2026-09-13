
/* ============================================================
   STUDYBUDDY
   Frontend prototype / demo interaction
============================================================ */


/* ============================================================
   DEMO DATA
============================================================ */

const students = [

    {
        id: 1,

        name: "Paing Htoo Kyaw",
        age: 20,

        major: "Digital Technology",

        subjects: [
            "DTI224",
            "GEN102"
        ],

        distance: "1.2 km away",

        match: 92,

        bio:
            "Preparing for the DTI224 exam and looking for someone to review with.",

        availability:
            "Afternoon · Library",

        image:
            "https://thumbs.dreamstime.com/b/college-boy-holding-books-blurred-students-park-portrait-standing-35784759.jpg",

        online: true

    },


    {
        id: 2,

        name: "Han Win Htun",
        age: 20,

        major: "Digital Technology",

        subjects: [
            "GEN102",
            "GEN132"
        ],

        distance: "2.4 km away",

        match: 86,

        bio:
            "Usually studies in the afternoon and likes working through practice questions together.",

        availability:
            "Afternoon · Study Room",

        image:
            "https://img.magnific.com/free-photo/portrait-student-boy_23-2147668972.jpg?semt=ais_test_b&w=740&q=80",

        online: false

    },


    {
        id: 3,

        name: "Nay Chi",
        age: 19,

        major: "Digital Technology",

        subjects: [
            "DTI224",
            "DTI201"
        ],

        distance: "3.1 km away",

        match: 82,

        bio:
            "Looking for someone to prepare for programming and data classes with.",

        availability:
            "Evening · Cafe",

        image:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900",

        online: true

    }

];


/* ============================================================
   APPLICATION STATE
============================================================ */

let currentScreen = "screen-splash";

let currentStudentIndex = 0;

let currentStudent = students[0];

let onboardingStep = 1;

let selectedSubjects = [
    "DTI224",
    "GEN102"
];

let savedProfiles = [];

let isLoggedIn = false;


/* ============================================================
   DOM HELPERS
============================================================ */

function get(id) {
    return document.getElementById(id);
}


/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    showWelcomeState();

    setupSwipeEvents();

    renderCards();

});


/* ============================================================
   SCREEN NAVIGATION
============================================================ */

function navigateTo(screenId, navButton = null) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    const target = get(screenId);

    if (!target) {
        console.warn(`Screen not found: ${screenId}`);
        return;
    }


    target.classList.add("active");

    currentScreen = screenId;


    /*
        Main application screens show the
        app header and bottom navigation.
    */

    const appScreens = [
        "screen-home",
        "screen-profile-detail",
        "screen-schedule",
        "screen-chat",
        "screen-profile"
    ];

    const isAppScreen =
        appScreens.includes(screenId);


    const header = get("app-header");

    const navigation =
        get("bottom-navigation");


    if (isAppScreen) {

        header.classList.add("visible");

        navigation.style.display = "grid";

    } else {

        header.classList.remove("visible");

        navigation.style.display = "none";

    }


    /*
        Update active bottom navigation.
    */

    if (navButton) {

        document
            .querySelectorAll(".nav-item")
            .forEach(item => {
                item.classList.remove("active");
            });

        navButton.classList.add("active");

    } else {

        updateNavigationState(screenId);

    }


    /*
        Scroll selected screen to top.
    */

    target.scrollTop = 0;

}


/* ============================================================
   NAVIGATION STATE
============================================================ */

function updateNavigationState(screenId) {

    const mapping = {

        "screen-home":
            "nav-discover",

        "screen-schedule":
            "nav-sessions",

        "screen-chat":
            "nav-messages",

        "screen-profile":
            "nav-profile"

    };


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });


    const navId = mapping[screenId];

    if (navId) {

        const nav =
            get(navId);

        if (nav) {
            nav.classList.add("active");
        }

    }

}


/* ============================================================
   LOGIN
============================================================ */

function login() {

    const button =
        get("login-btn");

    const text =
        get("login-text");


    button.disabled = true;

    text.textContent = "Signing you in…";


    setTimeout(() => {

        isLoggedIn = true;

        button.disabled = false;

        text.textContent =
            "Continue with Google";


        navigateTo("screen-onboarding");

    }, 650);

}


/* ============================================================
   ONBOARDING
============================================================ */

function nextOnboardingStep() {

    if (onboardingStep === 1) {

        const name =
            get("setup-name").value.trim();

        if (!name) {

            showToast(
                "Please enter your name."
            );

            get("setup-name").focus();

            return;

        }


        onboardingStep = 2;

        updateOnboardingUI();

        return;

    }


    completeOnboarding();

}


function updateOnboardingUI() {

    const step1 =
        get("onboarding-step-1");

    const step2 =
        get("onboarding-step-2");


    const title =
        get("onboarding-title");

    const description =
        get("onboarding-description");

    const indicator =
        get("wizard-step");

    const progress =
        get("wizard-progress");

    const button =
        get("onboarding-action");


    if (onboardingStep === 1) {

        step1.classList.add("active");

        step2.classList.remove("active");

        title.innerHTML =
            "Tell us about<br>yourself.";

        description.textContent =
            "This helps us find study partners who are a good fit for you.";

        indicator.textContent =
            "1 of 2";

        progress.style.width =
            "50%";

        button.textContent =
            "Continue";

    } else {

        step1.classList.remove("active");

        step2.classList.add("active");

        title.innerHTML =
            "What are you<br>studying?";

        description.textContent =
            "Choose the subjects you want help with.";

        indicator.textContent =
            "2 of 2";

        progress.style.width =
            "100%";

        button.textContent =
            "Start discovering";

    }

}


/* ============================================================
   SUBJECT SELECTION
============================================================ */

function toggleSubject(button) {

    const subject =
        button.dataset.subject;


    button.classList.toggle("selected");


    if (button.classList.contains("selected")) {

        if (!selectedSubjects.includes(subject)) {

            selectedSubjects.push(subject);

        }

    } else {

        selectedSubjects =
            selectedSubjects.filter(
                item => item !== subject
            );

    }

}


/* ============================================================
   COMPLETE ONBOARDING
============================================================ */

function completeOnboarding() {

    if (selectedSubjects.length === 0) {

        showToast(
            "Choose at least one subject."
        );

        return;

    }


    const name =
        get("setup-name").value.trim();


    if (name) {

        get("profile-display-name")
            .textContent = name;

    }


    /*
        Reset discovery for the beginning
        of the demo journey.
    */

    currentStudentIndex = 0;

    currentStudent =
        students[0];


    renderCards();


    navigateTo(
        "screen-home",
        get("nav-discover")
    );

}


/* ============================================================
   DISCOVERY
============================================================ */

function renderCards(filter = "All") {

    const container =
        get("card-container");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    let visibleStudents =
        students.filter(student => {

            if (filter === "All") {
                return true;
            }

            return student.subjects.includes(filter);

        });


    /*
        Make sure there is always something
        available for the demo.
    */

    if (visibleStudents.length === 0) {

        visibleStudents =
            students;

    }


    visibleStudents
        .slice()
        .reverse()
        .forEach((student, reverseIndex) => {

            const card =
                createProfileCard(
                    student,
                    reverseIndex === visibleStudents.length - 1
                );

            container.appendChild(card);

        });


    /*
        Current demo student is always
        the first visible student.
    */

    currentStudent =
        visibleStudents[0];

}


function createProfileCard(student, isTopCard) {

    const card =
        document.createElement("article");


    card.className =
        "profile-card";


    card.dataset.studentId =
        student.id;


    if (!isTopCard) {

        card.style.pointerEvents =
            "none";

    }


    card.innerHTML = `

        <div
            class="profile-card-image"
            style="
                background-image:
                url('${student.image}');
            "
        ></div>

        <div
            class="swipe-indicator like"
        >
            CONNECT
        </div>

        <div
            class="swipe-indicator nope"
        >
            PASS
        </div>

        <div class="profile-card-content">

            <div class="profile-card-topline">

                ${
                    student.online
                        ? `<span class="profile-card-online"></span>`
                        : ""
                }

                <span>
                    ${
                        student.online
                            ? "Online now"
                            : "Recently active"
                    }
                </span>

            </div>

            <div class="profile-card-name">
                ${student.name}, ${student.age}
            </div>

            <div class="profile-card-major">
                ${student.major}
            </div>

            <div class="profile-card-match">
                ${student.match}% study match
            </div>

            <div class="profile-card-subjects">

                ${student.subjects
                    .map(subject =>
                        `<span>${subject}</span>`
                    )
                    .join("")
                }

            </div>

            <div class="profile-card-distance">
                ${student.distance}
            </div>

        </div>
    `;


    /*
        Tap card → detailed profile.
    */

    card.addEventListener("click", event => {

        /*
            Ignore clicks after a drag.
        */

        if (card.dataset.dragged === "true") {

            card.dataset.dragged =
                "false";

            return;

        }


        openProfileDetail(student);

    });


    return card;

}


/* ============================================================
   FILTERS
============================================================ */

function filterCards(subject, button) {

    document
        .querySelectorAll(".filter-chip")
        .forEach(chip => {

            chip.classList.remove("active");

        });


    button.classList.add("active");


    renderCards(subject);

}


/* ============================================================
   PROFILE DETAIL
============================================================ */

function openProfileDetail(student) {

    currentStudent =
        student;


    get("detail-photo")
        .style.backgroundImage =
        `url('${student.image}')`;


    get("detail-name")
        .textContent =
        `${student.name}, ${student.age}`;


    get("detail-major")
        .textContent =
        `${student.major}`;


    get("detail-bio")
        .textContent =
        student.bio;


    get("detail-button-name")
        .textContent =
        student.name.split(" ")[0];


    get("detail-subjects")
        .innerHTML =
        student.subjects
            .map(subject =>
                `<span>${subject}</span>`
            )
            .join("");


    navigateTo(
        "screen-profile-detail"
    );

}


/* ============================================================
   CONNECT FROM PROFILE
============================================================ */

function connectFromDetail() {

    showMatchScreen(
        currentStudent
    );

}


/* ============================================================
   SWIPE SYSTEM
============================================================ */

let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;
let activeCard = null;


function setupSwipeEvents() {

    document.addEventListener(
        "pointerdown",
        handlePointerDown
    );

    document.addEventListener(
        "pointermove",
        handlePointerMove
    );

    document.addEventListener(
        "pointerup",
        handlePointerUp
    );

}


function getTopCard() {

    const cards =
        document.querySelectorAll(
            ".profile-card"
        );


    if (!cards.length) {
        return null;
    }


    return cards[
        cards.length - 1
    ];

}


function handlePointerDown(event) {

    if (
        currentScreen !==
        "screen-home"
    ) {
        return;
    }


    const card =
        getTopCard();


    if (!card) {
        return;
    }


    /*
        Don't start dragging from
        non-card UI.
    */

    if (
        !event.target.closest(
            ".profile-card"
        )
    ) {
        return;
    }


    activeCard =
        card;

    isDragging = true;

    dragStartX =
        event.clientX;

    dragCurrentX =
        event.clientX;

    card.dataset.dragged =
        "false";

    card.style.transition =
        "none";

}


function handlePointerMove(event) {

    if (
        !isDragging ||
        !activeCard
    ) {
        return;
    }


    dragCurrentX =
        event.clientX;


    const deltaX =
        dragCurrentX -
        dragStartX;


    const rotation =
        deltaX * 0.07;


    activeCard.style.transform =
        `translateX(${deltaX}px) rotate(${rotation}deg)`;


    activeCard.dataset.dragged =
        "true";


    const like =
        activeCard.querySelector(
            ".swipe-indicator.like"
        );

    const nope =
        activeCard.querySelector(
            ".swipe-indicator.nope"
        );


    if (deltaX > 20) {

        like.style.opacity =
            Math.min(
                deltaX / 100,
                1
            );

        nope.style.opacity =
            "0";

    } else if (deltaX < -20) {

        nope.style.opacity =
            Math.min(
                Math.abs(deltaX) / 100,
                1
            );

        like.style.opacity =
            "0";

    } else {

        like.style.opacity =
            "0";

        nope.style.opacity =
            "0";

    }

}


function handlePointerUp() {

    if (
        !isDragging ||
        !activeCard
    ) {
        return;
    }


    const deltaX =
        dragCurrentX -
        dragStartX;


    isDragging =
        false;


    if (Math.abs(deltaX) > 100) {

        const direction =
            deltaX > 0
                ? "right"
                : "left";


        swipeCard(
            activeCard,
            direction
        );

    } else {

        activeCard.style.transition =
            "transform .35s var(--ease)";

        activeCard.style.transform =
            "";


        const indicators =
            activeCard.querySelectorAll(
                ".swipe-indicator"
            );


        indicators.forEach(
            indicator => {
                indicator.style.opacity =
                    "0";
            }
        );

    }


    activeCard =
        null;

}


/* ============================================================
   BUTTON SWIPE
============================================================ */

function manualSwipe(direction) {

    const card =
        getTopCard();


    if (!card) {
        return;
    }


    swipeCard(
        card,
        direction
    );

}


/* ============================================================
   SWIPE CARD
============================================================ */

function swipeCard(card, direction) {

    card.style.transition =
        "transform .4s var(--ease), opacity .35s ease";


    const distance =
        direction === "right"
            ? window.innerWidth * 1.2
            : -window.innerWidth * 1.2;


    const rotation =
        direction === "right"
            ? 25
            : -25;


    card.style.transform =
        `translateX(${distance}px) rotate(${rotation}deg)`;


    card.style.opacity =
        "0";


    setTimeout(() => {

        if (direction === "right") {

            showMatchScreen(
                currentStudent
            );

        }


        advanceStudent();

    }, 320);

}


/* ============================================================
   NEXT STUDENT
============================================================ */

function advanceStudent() {

    currentStudentIndex++;


    if (
        currentStudentIndex >=
        students.length
    ) {

        currentStudentIndex = 0;

    }


    currentStudent =
        students[
            currentStudentIndex
        ];


    setTimeout(() => {

        renderCards();

    }, 100);

}


/* ============================================================
   SAVE PROFILE
============================================================ */

function saveCurrentProfile() {

    if (!currentStudent) {
        return;
    }


    if (
        !savedProfiles.includes(
            currentStudent.id
        )
    ) {

        savedProfiles.push(
            currentStudent.id
        );

        showToast(
            `${currentStudent.name} saved.`
        );

    } else {

        showToast(
            "Already saved."
        );

    }

}


/* ============================================================
   MATCH
============================================================ */

function showMatchScreen(student) {

    currentStudent =
        student;


    get("match-subject")
        .textContent =
        student.subjects[0];


    get("match-image")
        .style.backgroundImage =
        `url('${student.image}')`;


    const overlay =
        get("match-overlay");


    overlay.classList.add(
        "visible"
    );


    /*
        Stop background scrolling.
    */

    document.body.style.overflow =
        "hidden";

}


function closeMatchScreen() {

    get("match-overlay")
        .classList.remove(
            "visible"
        );


    document.body.style.overflow =
        "";


    navigateTo(
        "screen-home",
        get("nav-discover")
    );

}


function goToChatFromMatch() {

    get("match-overlay")
        .classList.remove(
            "visible"
        );


    document.body.style.overflow =
        "";


    openChatRoom(
        currentStudent.name,
        currentStudent.image
    );

}


/* ============================================================
   CHAT
============================================================ */

function openChatRoom(
    name,
    image
) {

    get("chat-room-name")
        .textContent =
        name;


    get("chat-room-avatar")
        .style.backgroundImage =
        `url('${image}')`;


    /*
        Chat is a full-screen
        secondary state.
    */

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


    get("screen-chat-room")
        .classList.add(
            "active"
        );


    currentScreen =
        "screen-chat-room";


    get("chat-messages-scroll")
        .scrollTop =
        get("chat-messages-scroll")
            .scrollHeight;

}


function closeChatRoom() {

    navigateTo(
        "screen-chat",
        get("nav-messages")
    );

}


/* ============================================================
   CHAT MESSAGE
============================================================ */

function handleChatKeyPress(event) {

    if (
        event.key === "Enter"
    ) {

        event.preventDefault();

        sendChatMessage();

    }

}


function sendChatMessage() {

    const input =
        get("chat-message-input");


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    const messages =
        get("chat-messages-scroll");


    const message =
        document.createElement("div");


    message.className =
        "message sent";


    const time =
        new Date()
            .toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


    message.innerHTML = `

        <div class="message-bubble">
            ${escapeHTML(text)}
        </div>

        <span>
            ${time} · Sent
        </span>

    `;


    messages.appendChild(
        message
    );


    input.value =
        "";


    messages.scrollTop =
        messages.scrollHeight;


    /*
        Small demo response.
    */

    setTimeout(() => {

        const reply =
            document.createElement(
                "div"
            );


        reply.className =
            "message received";


        reply.innerHTML = `

            <div class="message-bubble">
                Sounds good!
            </div>

            <span>
                Just now
            </span>

        `;


        messages.appendChild(
            reply
        );


        messages.scrollTop =
            messages.scrollHeight;

    }, 900);

}


/* ============================================================
   ESCAPE USER INPUT
============================================================ */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* ============================================================
   SCHEDULE CREATOR
============================================================ */

function openScheduleCreator() {

    navigateTo(
        "screen-schedule-create"
    );

}


function closeScheduleCreator() {

    navigateTo(
        "screen-chat-room"
    );

}


/* ============================================================
   CONFIRM SESSION
============================================================ */

function confirmSession() {

    const overlay =
        get("session-confirmed");


    overlay.classList.add(
        "visible"
    );


    document.body.style.overflow =
        "hidden";

}


function closeConfirmation() {

    get("session-confirmed")
        .classList.remove(
            "visible"
        );


    document.body.style.overflow =
        "";

}


function viewConfirmedSession() {

    closeConfirmation();


    navigateTo(
        "screen-schedule",
        get("nav-sessions")
    );


    showToast(
        "Your session is confirmed."
    );

}


/* ============================================================
   FILTER BUTTON
============================================================ */

function toggleFilters() {

    showToast(
        "Filters are ready for the next update."
    );

}


/* ============================================================
   NOTIFICATIONS
============================================================ */

function showNotification() {

    showToast(
        "You're all caught up."
    );

}


/* ============================================================
   LOGOUT
============================================================ */

function logout() {

    isLoggedIn =
        false;


    onboardingStep =
        1;


    updateOnboardingUI();


    navigateTo(
        "screen-splash"
    );


    showToast(
        "Signed out."
    );

}


/* ============================================================
   WELCOME STATE
============================================================ */

function showWelcomeState() {

    const header =
        get("app-header");

    const navigation =
        get("bottom-navigation");


    header.classList.remove(
        "visible"
    );


    navigation.style.display =
        "none";

}


/* ============================================================
   TOAST
============================================================ */

let toastTimer;


function showToast(message) {

    const toast =
        get("toast");


    toast.textContent =
        message;


    toast.classList.add(
        "visible"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "visible"
            );

        }, 2200);

}
