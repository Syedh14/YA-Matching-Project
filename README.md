# YA-Matching Project 

A full‑stack wiki application built with HTML, CSS, JavaScript, React, Tailwind CSS, Express, and MySQL. 

---

## 🚀 Setup

1. **Clone the repo**

   ```bash
   
   git clone https://github.com/Syedh14/YA-Matching-Project.git
   cd yaproject
   
2. **Create a file named .env in the yaproject/backend directory**

   Include the MySQL database, host, user, password, database name, port.
   Create a secret key for the session of the current user so that another user can't log in onto that same session.
   Also, include a Gemini-2.0-Flash API key.
   The naming scheme for these variables should be in index.js and db.js.
   Set up your database in your MySQLWorkbench 8.0.

4. **Open up a terminal and input**

   ```bash

   cd yaproject   

   ```

   **Then input**

   ```bash

   cd backend

   npm install

   ```

   **Then to initialize the server, input**

   ```bash

   node index.js

5. **Open up another terminal and input**

   ```bash

   cd yaproject

   ```

   **Then to initialize the frontend of the website, input**

   ```bash

   npm install

   npm start


6. **Navigate to http://localhost:3000/ to see the application running**


---

##  System Description 

The Mentor Mentee website exists as a partnership with the charitable organization Youth Achieve. This system we’ve built is a full‑stack web application that ties together a user‑friendly front end, a RESTful back end, and a relational MentorMenteeDB to ensure every match and meeting is truly meaningful.

Users accessing the system will be first greeted by a modal with the choice to login as an Admin, Mentor, or Mentee. If the user has no account made yet, an option will be provided for signing up. Users can register their names, email, password, creating a single profile record in the central Users table with linked Emails and Phones entries. During onboarding, each participant selects their role (Admin, Mentor, or Mentee) and fills in the fields appropriate to that role. Mentors list their areas of expertise, academic background, personal goals, and activate or deactivate their availability status, while mentees describe their existing skills, academic standing, career aspirations, and affiliated institution. Each mentor and mentee will also have a designated slot to plug in their availability for potential meetups with whomever they’re matched with in the signup process. 

A matching engine using Gemini 2.0 Flash AI reviews every mentee’s stated goals against the full set of mentor skill profiles and available times, writing its recommendations into the Matches table along with a confidence score and default “Pending” approval status. Administrators access a dedicated dashboard—populated from Admins and Manages relations—where they can inspect AI suggestions, adjust pairings, and finalize matches. Once approved, those pairings become official mentor‑mentee links and trigger notification workflows for both users. The Admin dashboard will allow the Admin(s) to delete users off the platform entirely, should their behavior become troubling based on feedback from the corresponding mentor/mentee. 

Within the Mentors and Mentee dashboard home pages, each respective party should be able to view a calendar of the current month with cells representing potential sessions and times that both the mentor and the mentee could meet. Within this calendar, each party can confirm their sessions, choosing whether for it to be in-person (with just descriptions of the location that they can put in) or online (with a Zoom link that they can put in). These sessions are then attended via Zoom link or by going to the in-person location. There should also be a section within the homepage dedicated to the specific person that they’re matched with. For a Mentee, they should be able to click on their Mentor section and view all of the Mentor’s information that they plugged in when they made their account, except their password. For a Mentor who can take on multiple Mentees at once, their Mentee section allows them to select from a dropdown menu of all the mentees they have and view their respective information there as well. Finally within each homepage, there is a small feedback section. The Mentor can give out comments and a feedback score for their respective mentee regarding their personality and commitment and the Mentee can do the same for their Mentor. The homepage is just one of four main pages making up the dashboard for either party, however. 

On another page lies the Progress Reports page. In this page, Mentors can document structured progress reports for their respective mentees with fields like “Areas of Improvement”, “Challenges Encountered”, and “Skills Gained.” This will be submitted into a grid-like layout. The Mentor is the only one who can write these while the Mentee can only view them. This is an opportunity for the Mentees to see how far their relations with their Mentors have come. These resources can be identified by the user ID and can be sorted based on that or the date created. 

On another page lies the Resource page. In this page, both Mentors and Mentees alike can share Resources for current or future users of the app. These can be articles regarding how to be a better mentor or mentee, video tutorials on how to perform specific exercises on subjects like math or science, etc. Either party can submit either a video (with a YouTube link) or an article (with manually typed content). There are two main sections within this Resources page: My Resources (made by the current user) and Global Resources (made by other users). This page also has filters, including “All”, “My Resources”, “Global Resources”, “Mentor Resources”, “Mentee Resources”, and “Videos.” 

Lastly, there’s the Profile Page. In this page, the user has an overview of all the attributes that they plugged in when they created the account in the Sign in page. It has an Edit button so that one can change their name, email, phone, skills, goals, etc. It also has a Logout button for when the user is finished with their respective time on the application.
   
