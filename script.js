document.addEventListener('DOMContentLoaded', function () {
    renderCalendar();
    document.getElementById('prevMonthBtn').addEventListener('click', function () {
        showPreviousMonth();
    });
    document.getElementById('nextMonthBtn').addEventListener('click', function () {
        showNextMonth();
    });
});

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function renderCalendar() {
    const calendarElement = document.getElementById('calendar');
    const currentMonthElement = document.getElementById('currentMonth');

    const today = new Date();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    currentMonthElement.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth));

    calendarElement.innerHTML = '';

    // Voeg lege cellen toe voor de dagen van de week vóór de eerste dag van de maand
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = createDayElement(null);
        calendarElement.appendChild(emptyDay);
    }

    // Voeg de dagen van de maand toe
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = createDayElement(new Date(currentYear, currentMonth, i));
        calendarElement.appendChild(dayElement);
    }
}

function showPreviousMonth() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }

    renderCalendar();
}

function showNextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }

    renderCalendar();
}

function createDayElement(date) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    if (date) {
        dayElement.textContent = date.getDate();
        dayElement.addEventListener('click', function () {
            showDayModal(date);
        });

        if (isSameDay(date, new Date())) {
            dayElement.classList.add('current-day');
        }

        const events = getEventsForDate(date);
        if (events.length > 0) {
            const eventsIndicator = document.createElement('div');
            eventsIndicator.className = 'events-indicator';
            eventsIndicator.textContent = events.length;
            dayElement.appendChild(eventsIndicator);
        }
    }
    return dayElement;
}

function showDayModal(selectedDate) {
    const modalContent = `
        <div class="modal-header">
            <h2>${selectedDate.toDateString()}</h2>
        </div>
        <div class="modal-body">
            <ul id="eventsList"></ul>
            <label for="startTimeInput">Begin tijd:</label>
            <input type="time" id="startTimeInput" class="time-input">
            <label for="endTimeInput">Eind tijd:</label>
            <input type="time" id="endTimeInput" class="time-input">
            <button id="addEventBtn">Voeg gebeurtenis toe</button>
        </div>
        <div class="modal-footer">
            <button id="closeModalBtn">Sluiten</button>
        </div>
    `;

    showModal(modalContent);

    const eventsList = document.getElementById('eventsList');
    const addEventBtn = document.getElementById('addEventBtn');
    const startTimeInput = document.getElementById('startTimeInput');
    const endTimeInput = document.getElementById('endTimeInput');

    addEventBtn.addEventListener('click', function () {
        const eventTitle = prompt(`Voeg een gebeurtenis toe voor ${selectedDate.toDateString()}:`);
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        if (eventTitle && startTime && endTime) {
            const events = getEvents();
            events.push({ date: selectedDate.toDateString(), title: eventTitle, startTime: startTime, endTime: endTime });
            localStorage.setItem('events', JSON.stringify(events));
            renderEventsList(selectedDate);
        }
    });

    renderEventsList(selectedDate);
}

function toggleView() {
    // Voeg hier de logica toe om tussen maand- en weekweergave te schakelen
    // Bijvoorbeeld: console.log("Wissel weergave");
}

function renderEventsList(selectedDate) {
    const events = getEventsForDate(selectedDate);
    const eventsList = document.getElementById('eventsList');

    eventsList.innerHTML = '';

    events.forEach(event => {
        const li = document.createElement('li');
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Verwijder';
        deleteBtn.addEventListener('click', function () {
            if (confirm('Weet je zeker dat je deze gebeurtenis wilt verwijderen?')) {
                removeEvent(selectedDate, event.title, event.startTime);
                renderEventsList(selectedDate);
            }
        });
        li.className = 'event-item';
        li.textContent = `${event.title} - ${event.startTime} tot ${event.endTime}`;
        li.appendChild(deleteBtn);
        eventsList.appendChild(li);
    });
}

function removeEvent(date, title, startTime) {
    const events = getEvents();
    const index = events.findIndex(event => event.date === date.toDateString() && event.title === title && event.startTime === startTime);
    if (index !== -1) {
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
    }
}

function showModal(content) {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.innerHTML = `
        <div class="modal">
            ${content}
        </div>
    `;
    
    document.body.appendChild(modalContainer);

    const closeModalBtn = document.getElementById('closeModalBtn');
    closeModalBtn.addEventListener('click', function () {
        document.body.removeChild(modalContainer);
    });
}

function getEvents() {
    const eventsString = localStorage.getItem('events');
    return eventsString ? JSON.parse(eventsString) : [];
}

function getEventsForDate(date) {
    const events = getEvents();
    return events.filter(event => event.date === date.toDateString());
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}


// Initieel de kalender renderen
renderCalendar();
