// Fetch upcoming events from the API when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

// Fetch events function
function fetchEvents() {
    fetch('http://localhost:3000/api/events')
        .then(response => response.json())
        .then(data => {
            displayEvents(data);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
}

// Display events on the page
function displayEvents(events) {
    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = ''; // Clear current events

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Dato:</strong> ${event.date}</p>
            <p><strong>Lokation:</strong> ${event.location}</p>
            <button onclick="window.location.href='event-details.html?event_id=${event.id}'">Se detaljer</button>
        `;
        eventList.appendChild(eventCard);
    });
}

// Handle event creation form submission
const eventForm = document.querySelector('form');
if (eventForm) {
    eventForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newEvent = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            location: document.getElementById('location').value
        };

        createEvent(newEvent);
    });
}

// Create new event via API
function createEvent(eventData) {
    fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Event created successfully!');
                fetchEvents(); // Re-fetch events after creation
            } else {
                alert('Error creating event!');
            }
        })
        .catch(error => {
            console.error('Error creating event:', error);
        });
}
