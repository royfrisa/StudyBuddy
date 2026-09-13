let matchOccurred = false;
let currentMatchPartner = null;
let currentMatchImage = null;

// Database of student cards
const allStudents = [
    {
        name: "Kyaw Zaw Win", id: "250702408173", major: "Civil Engineering", subject: "GEN132", time: "Tomorrow, 10:00 AM",
        image: "https://img.magnific.com/free-photo/portrait-student-boy_23-2147668972.jpg?semt=ais_test_b&w=740&q=80"
    },
    {
        name: "Aung Maw Oo", id: "250702874274", major: "Thai for Comm", subject: "GEN102", time: "Friday, 1:00 PM",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBoqz5mPMTPK4QekIl29l8XQBpiHoEiq4M0oi7xDSsnzuRuHfyTfXax4I&s=10"
    },
    {
        name: "Paing Htoo Kyaw", id: "250702408381", major: "Digital Tech", subject: "DTI224", time: "Today, 4:00 PM",
        image: "https://thumbs.dreamstime.com/b/college-boy-holding-books-blurred-students-park-portrait-standing-35784759.jpg"
    }
];

function navigateTo(screenId, navElement = null) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    targetScreen.classList.add('active');
    targetScreen.scrollTop = 0;

    if (navElement) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        navElement.classList.add('active');
    } else if (screenId !== 'screen-chat-room' && screenId !== 'screen-splash' && screenId !== 'screen-onboarding') {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.id === `nav-${screenId.split('-')[1]}`) {
                item.classList.add('active');
            }
        });
    }
}

// Simulated Google Auth leading into Profile Onboarding Wizard
function login() {
    const btnText = document.getElementById('login-text');
    const originalText = btnText.innerText;
    
    btnText.innerHTML = "Authenticating...";
    document.getElementById('login-btn').style.opacity = "0.8";
    document.getElementById('login-btn').style.pointerEvents = "none";
    
    setTimeout(() => {
        navigateTo('screen-onboarding');
        btnText.innerHTML = originalText;
        document.getElementById('login-btn').style.opacity = "1";
        document.getElementById('login-btn').style.pointerEvents = "auto";
    }, 1000);
}

function toggleSelectPill(btn) {
    btn.classList.toggle('active');
}

function completeOnboarding() {
    const customName = document.getElementById('setup-name').value;
    const customMajor = document.getElementById('setup-major').value;
    
    if(customName) {
        document.getElementById('display-profile-name').innerText = customName;
        document.getElementById('display-profile-major').innerText = customMajor;
    }

    document.getElementById('app-header').style.display = 'flex';
    document.getElementById('bottom-nav').style.display = 'flex';
    
    navigateTo('screen-home', document.getElementById('nav-home'));
    renderCards(allStudents);
}

function logout() {
    navigateTo('screen-splash');
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    matchOccurred = false;
}

// Dynamic Course Filtering
function filterCards(subjectTag, button) {
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    if (subjectTag === 'All') {
        renderCards(allStudents);
    } else {
        const filtered = allStudents.filter(s => s.subject === subjectTag);
        renderCards(filtered);
    }
}

const cardContainer = document.getElementById('card-container');

function renderCards(dataSet) {
    cardContainer.innerHTML = ''; 
    
    if(dataSet.length === 0) {
        cardContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
                <h3 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">No students found</h3>
                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">No profiles are available for this specific tag right now.</p>
                <button class="btn-primary" style="padding: 12px 24px; font-size: 14px;" onclick="filterCards('All', document.querySelector('.filter-chip'))">Reset Filter</button>
            </div>`;
        return;
    }

    dataSet.slice().reverse().forEach((student, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundImage = `url('${student.image}')`;
        card.dataset.name = student.name;
        card.dataset.subject = student.subject;
        card.dataset.image = student.image;
        
        if (index < dataSet.length - 1) {
            const scale = 1 - ((dataSet.length - 1 - index) * 0.05);
            card.style.transform = `scale(${scale})`;
        }
        
        card.innerHTML = `
            <div class="card-overlay"></div>
            <div class="card-content">
                <h2 class="student-name">${student.name}</h2>
                <div class="student-meta">
                    <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg> ${student.major}</p>
                    <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Free: ${student.time}</p>
                </div>
                <div class="card-pills">
                    <div class="pill glass"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> <span>${student.subject}</span></div>
                    <div class="pill glass"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span>1.2 km away</span></div>
                </div>
            </div>
        `;
        
        cardContainer.appendChild(card);
        initSwipe(card);
    });
}

function initSwipe(card) {
    let isDragging = false, startX = 0, currentX = 0;
    const getPos = (e) => e.touches ? e.touches[0].clientX : e.clientX;

    const onDragStart = (e) => {
        isDragging = true;
        startX = getPos(e);
        card.style.transition = 'none'; 
    };

    const onDragMove = (e) => {
        if (!isDragging) return;
        currentX = getPos(e);
        const deltaX = currentX - startX;
        const rotate = deltaX * 0.05;
        card.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg)`;
    };

    const onDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = currentX - startX;
        card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 
        const threshold = window.innerWidth * 0.3;

        if (deltaX > threshold) {
            swipeOut(card, 'right');
        } else if (deltaX < -threshold) {
            swipeOut(card, 'left');
        } else {
            card.style.transform = `translate3d(0px, 0, 0) rotate(0deg)`;
        }
    };

    card.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    card.addEventListener('touchstart', onDragStart, {passive: true});
    window.addEventListener('touchmove', onDragMove, {passive: true});
    window.addEventListener('touchend', onDragEnd);
}

function manualSwipe(direction) {
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        swipeOut(cards[cards.length - 1], direction);
    }
}

function swipeOut(card, direction) {
    const multiplier = direction === 'right' ? 1 : -1;
    card.style.transition = 'transform 0.4s ease-out';
    card.style.transform = `translate3d(${1000 * multiplier}px, 0, 0) rotate(${45 * multiplier}deg)`;
    
    setTimeout(() => {
        const studentName = card.dataset.name;
        const studentSubject = card.dataset.subject;
        const studentImage = card.dataset.image;
        
        card.remove();
        
        const remainingCards = document.querySelectorAll('.card');
        remainingCards.forEach((c, index) => {
            const scale = 1 - ((remainingCards.length - 1 - index) * 0.05);
            c.style.transition = 'transform 0.3s ease';
            c.style.transform = `scale(${scale})`;
        });

        if (direction === 'right' && !matchOccurred) {
            matchOccurred = true;
            showMatchScreen(studentName, studentSubject, studentImage);
        }

        if (cardContainer.children.length === 0) {
            cardContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align:center; padding: 20px;">
                    <h3 style="font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">You're caught up!</h3>
                    <p style="color:var(--text-muted); font-weight: 500; font-size: 14px; margin-bottom: 16px;">Check back later or reset your deck to view profiles again.</p>
                    <button class="btn-primary" style="padding: 12px 24px; font-size: 14px;" onclick="renderCards(allStudents)">Reload Deck ⟳</button>
                </div>`;
        }
    }, 350);
}

function showMatchScreen(name, subject, image) {
    currentMatchPartner = name;
    currentMatchImage = image;

    document.getElementById('match-name').textContent = name;
    document.getElementById('match-subject').textContent = subject;
    document.getElementById('match-image').style.backgroundImage = `url('${image}')`;
    document.getElementById('match-overlay').style.display = 'flex';
}

function closeMatchScreen() {
    document.getElementById('match-overlay').style.display = 'none';
}

function goToChatFromMatch() {
    closeMatchScreen();
    openChatRoom(currentMatchPartner, currentMatchImage);
}

// Active Live Chat Functionality
function openChatRoom(partnerName, partnerImage) {
    document.getElementById('chat-room-name').textContent = partnerName;
    document.getElementById('chat-room-avatar').style.backgroundImage = `url('${partnerImage}')`;
    
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    
    navigateTo('screen-chat-room');
    scrollToBottom();
}

function closeChatRoom() {
    document.getElementById('app-header').style.display = 'flex';
    document.getElementById('bottom-nav').style.display = 'flex';
    navigateTo('screen-chat', document.getElementById('nav-chat'));
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const inputField = document.getElementById('chat-message-input');
    const text = inputField.value.trim();
    if (!text) return;

    const chatScroll = document.getElementById('chat-messages-scroll');
    
    // Append sent message bubble
    const sentWrapper = document.createElement('div');
    sentWrapper.className = 'message-wrapper sent';
    sentWrapper.innerHTML = `
        <div class="message-bubble"><p>${text}</p></div>
        <span class="message-status">Sent</span>
    `;
    chatScroll.appendChild(sentWrapper);
    inputField.value = '';
    scrollToBottom();

    // Trigger simulated reply after a brief pause for realism
    setTimeout(() => {
        const replyWrapper = document.createElement('div');
        replyWrapper.className = 'message-wrapper received';
        replyWrapper.innerHTML = `
            <div class="message-bubble"><p>Got it! See you at the study hub soon 💡</p></div>
        `;
        chatScroll.appendChild(replyWrapper);
        scrollToBottom();
    }, 1200);
}

function scrollToBottom() {
    const chatArea = document.getElementById('chat-messages-scroll');
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 50);
}

document.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});
