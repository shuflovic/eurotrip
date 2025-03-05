// Declare variables in global scope
let googleSheetData = [];
let currentDate = new Date();
let rooms11 = JSON.parse(localStorage.getItem('rooms11')) || [];
let editingRoomIndex11 = -1;
let elements = {};

// Fetch Google Sheet Data
function fetchGoogleSheetData(spreadsheetId, sheetName, apiKey) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.values) {
                console.log("Google Sheet Data:", data.values);
                googleSheetData = data.values;
                populateRoomsFromTable();
            } else {
                console.error("No data found or error:", data);
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Populate Rooms from Sheet Data
function populateRoomsFromTable() {
    const selectedDate = document.getElementById('booking-date').value;
    rooms11 = JSON.parse(localStorage.getItem('rooms11')) || [];

    rooms11.forEach((room, index) => {
        const matchingEntry = googleSheetData.find(entry => {
            return entry[0] === selectedDate && entry[1] === room.roomName;
        });

        if (matchingEntry) {
            room.guestName = matchingEntry[2] || '';
            room.numGuests = parseInt(matchingEntry[3]) || 0;
            room.paymentStatus = matchingEntry[6] || 'choose';
        } else {
            room.guestName = '';
            room.numGuests = 0;
            room.paymentStatus = 'choose';
        }
    });
    localStorage.setItem('rooms11', JSON.stringify(rooms11));
    displayRooms11();
    updateGuestDataTable();
}

// Display Rooms
function displayRooms11() {
    if (!elements.mainSection11) return;
    elements.mainSection11.innerHTML = '';
    console.log('Displaying rooms:', rooms11);
    rooms11.forEach((room, index) => createRoomElement11(room, index));
}

// Create Room Element
function createRoomElement11(roomData, index) {
    roomData = { ...{
        roomName: '', maxGuests: 0, note: '', guestName: '', numGuests: 0,
        paymentStatus: 'choose', yenToPay: 0, roomStatus: 'Room is Ready'
    }, ...roomData };

    const roomContainer11 = document.createElement('div');
    roomContainer11.classList.add('room-container11');
    roomContainer11.innerHTML = `
        <div class="room-title11 room-name">${roomData.roomName}</div>
        <div class="room-status-text">${getRoomStatusText(roomData.roomStatus)}</div>
        <div class="guest-name-container">
            <input type="text" placeholder="guest name" value="${roomData.guestName}" class="guest-name-input">
        </div><br>
        <div class="guest-number-container">
            Nr. of Guests<input type="number" min="0" value="${roomData.numGuests}" class="guest-number-input">
        </div>
        <div class="guest-info">
            <label for="payment-status-${index}">Payment Status:</label>
            <select id="payment-status-${index}" name="payment-status-${index}">
                <option value="choose" ${roomData.paymentStatus === 'choose' ? 'selected' : ''}>Choose payment status</option>
                <option value="paid_advance" ${roomData.paymentStatus === 'paid_advance' ? 'selected' : ''}>Paid in Advance</option>
                <option value="paid_cash" ${roomData.paymentStatus === 'paid_cash' ? 'selected' : ''}>Paid by Cash</option>
                <option value="paid_card" ${roomData.paymentStatus === 'paid_card' ? 'selected' : ''}>Paid by Card</option>
                <option value="to_be_paid" ${roomData.paymentStatus === 'to_be_paid' ? 'selected' : ''}>To be Paid</option>
            </select>
        </div>
        <div class="yen-to-pay" style="display: ${roomData.paymentStatus === 'to_be_paid' ? 'block' : 'none'};">
            <label for="yen-to-pay-${index}">Yen to Pay:</label>
            <input type="number" id="yen-to-pay-${index}" value="${roomData.yenToPay}">
        </div>
        <div>Max: ${roomData.maxGuests}</div>
        <div>${roomData.note}</div>
        <button class="status-button" data-index="${index}">${roomData.roomStatus}</button>
        <button class="edit-room11" data-index="${index}">Edit</button>
    `;

    elements.mainSection11.appendChild(roomContainer11);

    const editButton = roomContainer11.querySelector('.edit-room11');
    const guestNameInput = roomContainer11.querySelector('.guest-name-input');
    const numGuestsInput = roomContainer11.querySelector('.guest-number-input');
    const paymentSelect = roomContainer11.querySelector(`#payment-status-${index}`);
    const yenToPayDiv = roomContainer11.querySelector('.yen-to-pay');
    const yenToPayInput = roomContainer11.querySelector(`#yen-to-pay-${index}`);
    const statusButton = roomContainer11.querySelector('.status-button');
    const roomStatusText = roomContainer11.querySelector('.room-status-text');

    editButton.addEventListener('click', () => editRoom11(index));
    guestNameInput.addEventListener('input', (e) => {
        rooms11[index].guestName = e.target.value;
        localStorage.setItem('rooms11', JSON.stringify(rooms11));
        updateGuestDataTable();
    });
    numGuestsInput.addEventListener('input', (e) => {
        rooms11[index].numGuests = parseInt(e.target.value) || 0;
        localStorage.setItem('rooms11', JSON.stringify(rooms11));
        updateGuestDataTable();
    });
    paymentSelect.addEventListener('change', (e) => {
        rooms11[index].paymentStatus = e.target.value;
        yenToPayDiv.style.display = e.target.value === 'to_be_paid' ? 'block' : 'none';
        if (e.target.value !== 'to_be_paid') {
            rooms11[index].yenToPay = 0;
            yenToPayInput.value = 0;
        }
        localStorage.setItem('rooms11', JSON.stringify(rooms11));
        updateGuestDataTable();
    });
    yenToPayInput.addEventListener('input', (e) => {
        rooms11[index].yenToPay = parseInt(e.target.value) || 0;
        localStorage.setItem('rooms11', JSON.stringify(rooms11));
        updateGuestDataTable();
    });
    statusButton.addEventListener('click', () => {
        const statuses = ["Room is Ready", "Checked-In", "Checked-Out"];
        const currentIndex = statuses.indexOf(rooms11[index].roomStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        rooms11[index].roomStatus = statuses[nextIndex];
        statusButton.textContent = rooms11[index].roomStatus;
        roomStatusText.textContent = getRoomStatusText(rooms11[index].roomStatus);
        localStorage.setItem('rooms11', JSON.stringify(rooms11));
    });
}

// Update Guest Data Table
function updateGuestDataTable() {
    const tbody = document.getElementById('guestDataTableBody');
    tbody.innerHTML = '';
    
    const selectedDate = document.getElementById('booking-date').value;
    rooms11.forEach(room => {
        if (room.guestName || room.numGuests > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${selectedDate}</td>
                <td>${room.roomName}</td>
                <td>${room.guestName}</td>
                <td>${room.numGuests}</td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td>${room.paymentStatus}</td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Room Status Text
function getRoomStatusText(roomStatus) {
    switch (roomStatus) {
        case "Checked-In": return "Awaiting Check-In";
        case "Checked-Out": return "Room is occupied";
        case "Room is Ready": return "Room to be cleaned";
        default: return "Awaiting Check-In";
    }
}

// Modal Functions
function openModal11() {
    if (elements.roomSetupModal11) {
        elements.roomSetupModal11.style.display = 'block';
        elements.roomNameInput11.value = '';
        elements.maxGuestsInput11.value = '';
        elements.roomNoteInput11.value = '';
        elements.removeRoomButton11.style.display = 'none';
        editingRoomIndex11 = -1;
    }
}

function closeModal11() {
    if (elements.roomSetupModal11) {
        elements.roomSetupModal11.style.display = 'none';
    }
}

// Save Room
function saveRoom11(addAnother = false) {
    const roomName = elements.roomNameInput11.value.trim();
    const maxGuests = parseInt(elements.maxGuestsInput11.value);
    const roomNote = elements.roomNoteInput11.value.trim();

    if (!roomName || isNaN(maxGuests) || maxGuests <= 0) {
        alert('Please provide a valid room name and number of guests.');
        return;
    }

    const roomData = {
        roomName, maxGuests, note: roomNote,
        guestName: '', numGuests: 0, paymentStatus: 'choose',
        yenToPay: 0, roomStatus: 'Room is Ready'
    };

    if (editingRoomIndex11 === -1) {
        rooms11.push(roomData);
    } else {
        rooms11[editingRoomIndex11] = { ...rooms11[editingRoomIndex11], ...roomData };
    }

    localStorage.setItem('rooms11', JSON.stringify(rooms11));
    displayRooms11();
    updateGuestDataTable();

    if (!addAnother) closeModal11();
    else {
        elements.roomNameInput11.value = '';
        elements.maxGuestsInput11.value = '';
        elements.roomNoteInput11.value = '';
    }
}

// Edit Room
function editRoom11(index) {
    editingRoomIndex11 = index;
    const room = rooms11[index];
    elements.roomNameInput11.value = room.roomName;
    elements.maxGuestsInput11.value = room.maxGuests;
    elements.roomNoteInput11.value = room.note || '';
    elements.roomSetupModal11.style.display = 'block';
    elements.removeRoomButton11.style.display = 'block';
}

// Remove Room
function removeRoom11() {
    if (editingRoomIndex11 !== -1) {
        rooms11.splice(editingRoomIndex11, 1);
        localStorage.setItem('rooms11', JSON.stringify(rooms11));
        displayRooms11();
        updateGuestDataTable();
        closeModal11();
    }
}

// Date Functions
function updateDateDisplay() {
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    
    const dateInput = document.getElementById('booking-date');
    dateInput.value = formattedDate;
    
    const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('day-of-week').textContent = dayOfWeek;
}

function adjustDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDateDisplay();
    populateRoomsFromTable();
}

// Event Listeners Setup
function setupEventListeners() {
    if (elements.roomSetupButton11) {
        elements.roomSetupButton11.addEventListener('click', () => {
            console.log('Room Setup clicked');
            openModal11();
        });
    }
    if (elements.closeButton11) elements.closeButton11.addEventListener('click', closeModal11);
    if (elements.cancelRoomButton11) elements.cancelRoomButton11.addEventListener('click', closeModal11);
    if (elements.saveRoomButton11) {
        elements.saveRoomButton11.addEventListener('click', () => {
            console.log('Save Room clicked');
            saveRoom11(false);
        });
    }
    if (elements.addRoomButton11) {
        elements.addRoomButton11.addEventListener('click', () => {
            console.log('Add Another clicked');
            saveRoom11(true);
        });
    }
    if (elements.removeRoomButton11) elements.removeRoomButton11.addEventListener('click', removeRoom11);
    if (elements.populateButton) {
        elements.populateButton.addEventListener('click', () => {
            console.log('Populate Rooms clicked');
            populateRoomsFromTable();
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === elements.roomSetupModal11) closeModal11();
    });
}

// Date Listeners Setup
function setupDateListeners() {
    const dateInput = document.getElementById('booking-date');
    dateInput.addEventListener('change', (e) => {
        const [day, month, year] = e.target.value.split('.');
        currentDate = new Date(year, month - 1, day);
        populateRoomsFromTable();
        updateDateDisplay();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    elements = {
        roomSetupButton11: document.getElementById('roomSetupButton11'),
        roomSetupModal11: document.getElementById('roomSetupModal11'),
        closeButton11: document.querySelector('.close11'),
        saveRoomButton11: document.getElementById('saveRoomButton11'),
        cancelRoomButton11: document.getElementById('cancelRoomButton11'),
        addRoomButton11: document.getElementById('addRoomButton11'),
        mainSection11: document.getElementById('mainSection11'),
        roomNameInput11: document.getElementById('roomName11'),
        maxGuestsInput11: document.getElementById('maxGuests11'),
        roomNoteInput11: document.getElementById('roomNote11'),
        removeRoomButton11: document.getElementById('removeRoomButton11'),
        populateButton: document.getElementById('populateButton')
    };

    // Check DOM Elements
    Object.entries(elements).forEach(([key, value]) => {
        console.log(`${key}: ${value ? 'found' : 'not found'}`);
        if (!value) console.error(`Element ${key} not found in DOM`);
    });

    setupEventListeners();
    setupDateListeners();
    displayRooms11();
    updateDateDisplay();

    const spreadsheetId = '177hihTgXiZy2ceOo7dTaO6pSO00jv_oZyJztyuK6hy0';
    const sheetName = 'tanigawa';
    const apiKey = 'AIzaSyBO9-A9HwPRCtPB8Y4Ax-iVpr6kVqupVWY';
    fetchGoogleSheetData(spreadsheetId, sheetName, apiKey);
});

// Global adjustDate for HTML button access
window.adjustDate = function(days) {
    const currentDate = new Date(document.getElementById('booking-date').value.split('.').reverse().join('-'));
    currentDate.setDate(currentDate.getDate() + days);
    document.getElementById('booking-date').value = 
        `${currentDate.getDate().toString().padStart(2, '0')}.` +
        `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.` +
        `${currentDate.getFullYear()}`;
    populateRoomsFromTable();
};