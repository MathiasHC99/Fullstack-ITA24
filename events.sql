-- Users table to store user information
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Events table to store event details
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    time TIME,
    location VARCHAR(255)
);

-- Event Participants table to store which users are attending which events
CREATE TABLE event_participants (
    event_id INT,
    user_id INT,
    status ENUM('accepted', 'declined', 'pending') DEFAULT 'pending',
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
