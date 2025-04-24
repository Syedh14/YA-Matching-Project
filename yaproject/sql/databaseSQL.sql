CREATE DATABASE MentorMenteeDB;

USE MentorMenteeDB;

CREATE TABLE Users (
	user_id INT AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	role ENUM('Admin', 'Mentor', 'Mentee') NOT NULL,
	PRIMARY KEY (user_id)
);

CREATE TABLE Emails (
	user_id INT NOT NULL,
	email VARCHAR(255) NOT NULL, 
	PRIMARY KEY (user_id, email), 
	FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Phones (
	user_id INT NOT NULL,
	phone VARCHAR(20) NOT NULL, 
	PRIMARY KEY (user_id, phone), 
	FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Mentors (
	mentor_id INT NOT NULL,
	active_status BOOLEAN DEFAULT TRUE,
	goals VARCHAR(255),
	date_joined DATE NOT NULL,
   	mentee_assigned_count INT DEFAULT 3,
	skills VARCHAR(255),  
   	academic_background VARCHAR(100),
	PRIMARY KEY (mentor_id),   	
	FOREIGN KEY (mentor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Mentees (
	mentee_id INT NOT NULL,
	skills VARCHAR(255), 
	academic_status VARCHAR(100),
	goals VARCHAR(255),
	date_joined DATE NOT NULL,
	institution VARCHAR(255),
	PRIMARY KEY (mentee_id),
	FOREIGN KEY (mentee_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


CREATE TABLE Mentor_Availability (
	mentor_id INT NOT NULL,
	available_date DATETIME NOT NULL,
	PRIMARY KEY (mentor_id, available_date), 
	FOREIGN KEY (mentor_id) REFERENCES Mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE Mentee_Availability (
	mentee_id INT NOT NULL,
	available_date DATETIME NOT NULL,
	PRIMARY KEY (mentee_id, available_date), 
	FOREIGN KEY (mentee_id) REFERENCES Mentees(mentee_id) ON DELETE CASCADE
);

CREATE TABLE Admins (
	admin_id INT NOT NULL,
	permission BOOLEAN DEFAULT TRUE,
	PRIMARY KEY (admin_id),
	FOREIGN KEY (admin_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Manages (
	admin_id INT NOT NULL, 
	mentor_id INT NOT NULL, 
	mentee_id INT NOT NULL, 
	PRIMARY KEY (admin_id, mentor_id, mentee_id), 
	FOREIGN KEY (admin_id) REFERENCES Admins (admin_id) ON DELETE CASCADE,
	FOREIGN KEY (mentee_id) REFERENCES Mentees (mentee_id) ON DELETE CASCADE,
	FOREIGN KEY (mentor_id) REFERENCES Mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE Matches (
	match_id INT AUTO_INCREMENT,
	mentor_id INT NOT NULL,
	mentee_id INT NOT NULL,
	admin_id INT NOT NULL,
	ai_model VARCHAR(255),
	match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	success_rate INT, 
	match_approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
	PRIMARY KEY (match_id),
	FOREIGN KEY (mentor_id) REFERENCES Mentors(mentor_id) ON DELETE CASCADE,
	FOREIGN KEY (mentee_id) REFERENCES Mentees(mentee_id) ON DELETE CASCADE,
	FOREIGN KEY (admin_id) REFERENCES Admins(admin_id) ON DELETE CASCADE
);


CREATE TABLE Sessions (
	session_id INT AUTO_INCREMENT,
	mentor_id INT NOT NULL, 
	mentee_id INT NOT NULL,
	duration INT,
	topics_covered VARCHAR(255),
	session_type ENUM('In-Person', 'Online'),
	session_date DATETIME NOT NULL,
	location VARCHAR(255),
	session_status ENUM('Potential', 'Actual') NOT NULL,
	PRIMARY KEY (session_id, mentor_id, mentee_id),
	FOREIGN KEY (mentor_id) REFERENCES Mentor_Availability(mentor_id) ON DELETE CASCADE,
	FOREIGN KEY (mentee_id) REFERENCES Mentee_Availability(mentee_id) ON DELETE CASCADE
);

CREATE TABLE Mentee_Feedback (
	feedback_id INT AUTO_INCREMENT,
	mentee_id INT NOT NULL,
	mentor_id INT NOT NULL,
	feedback_score INT CHECK (feedback_score BETWEEN 1 AND 5),
	comments VARCHAR(255),
	PRIMARY KEY (feedback_id, mentee_id, mentor_id),
	FOREIGN KEY (mentee_id) REFERENCES Mentees(mentee_id) ON DELETE CASCADE,
	FOREIGN KEY (mentor_id) REFERENCES Mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE Mentor_Feedback (
	feedback_id INT AUTO_INCREMENT,
	mentor_id INT NOT NULL,
	mentee_id INT NOT NULL,
	feedback_score INT CHECK (feedback_score BETWEEN 1 AND 5),
	comments VARCHAR(255),
	PRIMARY KEY (feedback_id, mentee_id, mentor_id),
   	FOREIGN KEY (mentor_id) REFERENCES Mentors(mentor_id) ON DELETE CASCADE,
	FOREIGN KEY (mentee_id) REFERENCES Mentees(mentee_id) ON DELETE CASCADE
 
);

CREATE TABLE Resources (
	resource_id INT AUTO_INCREMENT,
	user_id INT NOT NULL,  
	title VARCHAR(255) NOT NULL,
	description VARCHAR(255),
	resource_type ENUM('Article', 'Video') NOT NULL,
	url VARCHAR(500) NOT NULL, 
	upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (resource_id, user_id),
	FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Progress_Reports (
	report_id INT AUTO_INCREMENT,
	mentor_id INT NOT NULL,
	mentee_id INT NOT NULL,
	areas_of_improvement VARCHAR(255),  
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	challenges VARCHAR(255), 
	skills_improved VARCHAR(255),
	PRIMARY KEY (report_id, mentor_id),
	FOREIGN KEY (mentor_id) REFERENCES Mentors(mentor_id) ON DELETE CASCADE,
	FOREIGN KEY (mentee_id) REFERENCES Mentees(mentee_id) ON DELETE CASCADE
);


INSERT INTO Users (username, password, first_name, last_name, role) 
VALUES 
('admin_user', 'adminpass123', 'Alice', 'Smith', 'Admin'),
('mentor_user', 'mentorpass123', 'Bob', 'Johnson', 'Mentor'),
('mentor_jane', 'janepass456', 'Jane', 'Doe', 'Mentor'),
('mentor_mike', 'mikepass789', 'Mike', 'Anderson', 'Mentor'),
('mentor_linda', 'lindapass321', 'Linda', 'Nguyen', 'Mentor'),
('mentee_user', 'menteepass123', 'Charlie', 'Brown', 'Mentee'),
('mentee_emma', 'emmapass321', 'Emma', 'Watson', 'Mentee'),
('mentee_ryan', 'ryanpass654', 'Ryan', 'Lee', 'Mentee'),
('mentee_olivia', 'oliviapass987', 'Olivia', 'Martinez', 'Mentee');


INSERT INTO Emails (user_id, email) VALUES
(1, 'alice@example.com'),
(2, 'bob@example.com'),
(3, 'jane.doe@example.com'),
(4, 'mike.anderson@example.com'),
(5, 'charlie@example.com'),
(6, 'linda.nguyen@example.com'),
(7, 'emma.watson@example.com'),
(8, 'ryan.lee@example.com'),
(9, 'olivia.martinez@example.com');


INSERT INTO Phones (user_id, phone) VALUES
(1, '123-456-7890'),
(2, '234-567-8901'),
(3, '333-444-5555'),
(4, '444-555-6666'),
(5, '555-666-7777'),
(6, '666-777-8888'),
(7, '777-888-9999'),
(8, '888-999-0000'),
(9, '999-000-1111');

INSERT INTO Mentors (mentor_id, active_status, goals, date_joined, skills, academic_background) VALUES
(2, TRUE, 'Help mentees develop coding skills', '2024-01-15', 'Python, Java', 'Computer Science BSc'),
(3, TRUE, 'Guide mentees on academic paths', '2024-01-20', 'Data Analysis, Machine Learning', 'Data Science MSc'),
(4, TRUE, 'Support mentees with technical interviews', '2024-02-05', 'System Design, Algorithms', 'Software Engineering BEng'),
(5, TRUE, 'Provide career mentorship', '2024-02-15', 'Cloud Computing, DevOps', 'IT Management MBA');

INSERT INTO Mentees (mentee_id, skills, academic_status, goals, date_joined, institution) VALUES
(6, 'Basic Python', 'Undergraduate', 'Improve coding abilities', '2024-02-01', 'University of XYZ'),
(7, 'HTML/CSS', 'High School', 'Learn web development', '2024-03-01', 'Tech High School'),
(8, 'Java', 'Undergraduate', 'Build Android apps', '2024-03-05', 'University of ABC'),
(9, 'Excel', 'College Diploma', 'Transition to tech', '2024-03-07', 'Community College');

INSERT INTO Admins (admin_id, permission) 
VALUES (1, TRUE);

INSERT INTO Mentor_Availability (mentor_id, available_date) VALUES
(2, '2024-03-10 10:00:00'),
(3, '2024-03-12 09:00:00'),
(4, '2024-03-14 14:30:00'),
(5, '2024-03-15 16:00:00');

INSERT INTO Mentee_Availability (mentee_id, available_date) VALUES
(6, '2024-03-12 15:00:00'),
(7, '2024-03-13 11:00:00'),
(8, '2024-03-14 16:00:00'),
(9, '2024-03-16 13:30:00');


INSERT INTO Manages (admin_id, mentor_id, mentee_id) VALUES
(1, 2, 6),
(1, 3, 7),
(1, 4, 8),
(1, 5, 9);

INSERT INTO Matches (mentor_id, mentee_id, admin_id, ai_model, success_rate, match_approval_status) VALUES
(2, 6, 1, 'gemini-2.0-flash', 85, 'Approved'),
(3, 7, 1, 'gemini-2.0-flash', 90, 'Approved'),
(4, 8, 1, 'gemini-2.0-flash', 75, 'Approved'),
(5, 9, 1, 'gemini-2.0-flash', 80, 'Approved');

INSERT INTO Sessions 
(mentor_id, mentee_id, duration, topics_covered, session_type, session_date, location, session_status) 
VALUES
(2, 6, 60, 'Introduction to Python', 'In-Person', '2024-03-25 14:00:00', 'Room 101', 'Actual'),
(3, 7, 45, 'HTML Basics', 'Online', '2024-03-26 10:00:00', 'https://zoom.us/j/123456', 'Actual'),
(4, 8, 90, 'Android Studio Setup', 'In-Person', '2024-03-27 11:00:00', 'Campus Lab', 'Actual'),
(5, 9, 30, 'Intro to DevOps', 'Online', '2024-03-28 15:00:00', 'https://teams.microsoft.com/devops', 'Actual'),

(4, 8, 60, '', 'Online', '2024-04-10 13:00:00', '', 'Potential'),
(4, 8, 75, 'Advanced Android UI', 'In-Person', '2024-04-15 09:30:00', 'Room 202, Engineering Block', 'Actual'),
(4, 8, 45, '', 'Online', '2024-04-20 17:00:00', '', 'Potential'),
(4, 8, 30, 'Mobile App Design Review', 'In-Person', '2024-04-22 11:30:00', 'Innovation Hub', 'Actual');


INSERT INTO Mentor_Feedback (mentor_id, mentee_id, feedback_score, comments) VALUES
(2, 6, 5, 'Great mentor, very helpful!'),
(3, 7, 4, 'Clear guidance and very friendly'),
(4, 8, 3, 'Needs to be more punctual'),
(5, 9, 5, 'Provided great insights on career paths');

INSERT INTO Mentee_Feedback (mentee_id, mentor_id, feedback_score, comments) VALUES
(6, 2, 1, 'Very uncooperative. I fear for his future.'),
(7, 3, 5, 'Awesome mentor! Learned a lot.'),
(8, 4, 4, 'Helpful but needs better communication'),
(9, 5, 5, 'Excellent mentor. Very knowledgeable');

INSERT INTO Resources (user_id, title, description, resource_type, url) VALUES
(2, 'Resume Building Guide', 'A guide to writing resumes for tech jobs', 'Article', ''),
(3, 'Mock Interview Video', '', 'Video', 'https://www.youtube.com/watch?v=srw4r3htm4U'),
(4, 'Data Science Bootcamp', '', 'Video', 'https://www.youtube.com/watch?v=fIpKgyleBK0'),
(7, 'HTML Cheatsheet', 'Quick reference guide for HTML tags', 'Article', '');

INSERT INTO Progress_Reports (mentor_id, mentee_id, areas_of_improvement, date_created, challenges, skills_improved) VALUES
(2, 6, 'Improve debugging skills', NOW(), 'Struggles with complex SQL queries', 'Basic SQL, Python scripting'),
(3, 7, 'Structure web pages better', NOW(), 'Misunderstanding of tags', 'HTML layout, semantics'),
(4, 8, 'Enhance mobile UI skills', NOW(), 'Lack of Android experience', 'Android Studio basics'),
(5, 9, 'Build cloud project portfolio', NOW(), 'Does not understand pipelines', 'DevOps pipeline basics');


SELECT * FROM Users;
SELECT * FROM Emails WHERE user_id = 1;
SELECT * FROM Phones WHERE user_id = 1;
SELECT * FROM Mentors WHERE mentor_id = 2;
SELECT * FROM Mentees WHERE mentee_id = 6;
SELECT * FROM Mentor_Availability WHERE mentor_id = 2;
SELECT * FROM Mentee_Availability WHERE mentee_id = 6;
SELECT * FROM Admins WHERE admin_id = 1;
SELECT * FROM Manages WHERE admin_id = 1;
SELECT * FROM Matches WHERE match_id = 1;
SELECT * FROM Sessions WHERE session_id = 1;
SELECT * FROM Mentor_Feedback WHERE feedback_id = 1;
SELECT * FROM Mentee_Feedback WHERE feedback_id = 1;
SELECT * FROM Resources WHERE resource_id = 1;
SELECT * FROM Progress_Reports WHERE report_id = 1;

UPDATE Phones 
SET phone = '987-654-3210' 
WHERE user_id = 1;

UPDATE Mentors 
SET mentee_assigned_count = 4 
WHERE mentor_id = 2;

UPDATE Mentees 
SET goals = 'Master JavaScript' 
WHERE mentee_id = 6;

UPDATE Mentor_Availability 
SET available_date = '2024-03-26 14:00:00' 
WHERE mentor_id = 2;

UPDATE Mentee_Availability 
SET available_date = '2024-03-26 14:00:00' 
WHERE mentee_id = 6;

UPDATE Sessions 
SET topics_covered = 'Algebra' 
WHERE session_id = 1;

UPDATE Mentor_Feedback 
SET comments = 'Good student.’' 
WHERE feedback_id = 1;


UPDATE Mentee_Feedback 
SET comments = 'Session was awesome!' 
WHERE feedback_id = 1;

UPDATE Resources 
SET title = 'Advanced JavaScript Concepts' 
WHERE resource_id = 1;

UPDATE Progress_Reports 
SET areas_of_improvement = 'Mentee now proficient in JavaScript and React, watch more videos on abstraction' 
WHERE report_id = 1;

INSERT INTO Users (username, password, first_name, last_name, role) 
VALUES ('admin_user', 'adminpass123', 'Alice', 'Smith', 'Admin');

SET @admin_id = LAST_INSERT_ID();
INSERT INTO Admins (admin_id, permission) 
VALUES (@admin_id, TRUE);

INSERT INTO Phones (user_id, phone) 
VALUES 
(@admin_id, '4031234567'),
(@admin_id, '4037654321');

INSERT INTO Emails (user_id, email) 
VALUES 
(@admin_id, 'alice.smith@example.com'),
(@admin_id, 'admin.alice@mentorship.org');
