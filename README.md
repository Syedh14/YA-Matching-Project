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
   Also, include a Gemini-2.0-Flash API key. You can get this API key here: https://ai.google.dev/gemini-api/docs/quickstart?lang=node
   The naming scheme for these variables should be in index.js and db.js within the backend folder.
   Set up your database in your MySQLWorkbench 8.0. Please ensure that the database is in this version.

   ```bash
   
   You may need to run the following in MySQLWorkbench 8.0, ensure that the credentials in the code are replaced with appropriate credentials:
   ALTER USER 'root'@'localhost'
   IDENTIFIED WITH mysql_native_password BY 'your_root_password';
   FLUSH PRIVILEGES;


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


---

##  Users

Admins register with the same institution-verified credentials as other users but are flagged by the system as Admins and linked into the Admins and Manages tables; once logged in, they see an overview dashboard listing every mentor, mentee, and pending AI matches. From this console, they can drill down into any proposed pairing—each entry shows the Mentor, Mentee, AI confidence score, and historical success rates—and decide to approve, adjust, or reject the match. They can also remove users whose feedback flags consistent problems, revoke access, and reassign mentees as needed. 

Mentors sign up by providing expertise areas, academic background, personal goals, and a set of availability slots; that information populates the Mentors, Mentor_Availability, and related join tables in the database. On their dashboard they see a month-view calendar highlighting only the time slots that overlap with each of their assigned mentees’ availability. They confirm slots as “in-person” or “online,” entering a location description or Zoom link, and each confirmation creates a Sessions record. A dropdown menu lists all their mentees, letting them view each mentee’s profile (skills, aspirations, institution) and submit structured Progress_Reports—detailing areas for improvement, challenges, and skills gained—that mentees can later review. After each session they also complete Mentor_Feedback entries, scoring commitment and communication and leaving comments that feed into the system’s continuous-improvement loop.

Mentees create profiles capturing current skills, academic status, career aspirations, institution, and availability windows, which feed into the Mentees and Mentee_Availability tables. Their dashboard displays the single mentor they’ve been paired with—showing everything the mentor provided except sensitive login details—and a shared calendar of available slots. They confirm sessions just like mentors do, attend via the chosen method, and afterward fill out Mentee_Feedback forms rating the mentor’s guidance, expertise, and support. A read-only Progress Reports page surfaces the reports mentors have filed, so mentees can track their own growth over time. Finally, under Resources they browse or filter articles and videos—either global uploads or their own saved items—to supplement their learning and prepare for future sessions.


--- 

## User Interface 

![image5](https://github.com/user-attachments/assets/5b865025-6c04-4737-ba53-65834a3443f8)
Figure 1: Standard login page greets the user, where one can login as an Admin, Mentor or Mentee. If the user doesn’t have an account, they can create one easily via the prompt and link at the bottom. 

![image26](https://github.com/user-attachments/assets/134a9502-e2d5-4b7c-9ba0-63ff90faa860)
Figure 2: Account creation modal which appears on screen when the user clicks “Create an account.” In this modal, the user can input their name, username, password, email(s), phone(s), goals and skills. On the availability field, the user is presented with a calendar view where the user can put in the month, day, and time that they’d be available for potential sessions with a corresponding mentor/mentee. There is also a role field dropdown, where the user can be either a Mentor or Mentee. 

![image3](https://github.com/user-attachments/assets/1dfd6efa-c515-432c-93e2-129498aaf1f8)
Figure 3: Extra modal for signing up as a Mentor with additional fields. 

![image9](https://github.com/user-attachments/assets/f15cda19-8b0b-48aa-bf36-72567221c4ef)
Figure 4: Extra modal for signing up as a Mentor with additional fields. 

![image22](https://github.com/user-attachments/assets/d174fad8-7ebc-4836-abdf-038201ee34a8)
Figure 5: Admin login modal. 

![image10](https://github.com/user-attachments/assets/b3d2040f-6452-4dc7-8505-9071f619fc71)
Figure 6: Admin homepage with listings of all Mentors and Mentees under their watch. The Admin(s) can delete either party with a simple DELETE button. At the bottom lies the actual, clear Mentor-Mentee pairings. 

![image20](https://github.com/user-attachments/assets/41b367b6-16b6-480d-9704-6a72ccba18d1)
Figure 7: Admin AI matching page with listings of potential matches between any signed-in Mentors and Mentees. Gemini AI here will take in all the goals and skills from both participants and give the best match. It will prompt the Admin with the question of whether or not to accept the suggested matching.

![image37](https://github.com/user-attachments/assets/b4314c8c-29fc-4c4f-8e65-1f9ef6cad217)
Figure 8: You can click the gray box with the names of the mentor and the mentee to be brought to this modal. This will give the Admin details regarding the match, including the Mentor and Mentee names, match ID, the AI’s success rate (aka how compatible the AI found the match as a percentage), and the AI model.

![image17](https://github.com/user-attachments/assets/7de666c5-dedf-4107-8c49-d7968dbf4c89)
Figure 9: Admin profile with ID, name, contact info. There’s an Edit button which will allow you to edit the fields in this page. There’s also a Logout button that the Admin can click when they’re done with their current session, taking them back to the Login page.

![image39](https://github.com/user-attachments/assets/507d0e4e-9002-4a09-94e4-9c37a5c4fcd1)
Figure 10: Edit modal which popups when the Admin clicks on the Edit button. They can change their name, username and contact info. They can change their phones/emails or even add as many as they want. They have the option to cancel or save this new information via two buttons at the bottom right of the modal. 

![image12](https://github.com/user-attachments/assets/7f25d572-fcca-46f9-b3c9-b35fc03fc778)
Figure 11: Mentor login modal. 

![image35](https://github.com/user-attachments/assets/e3b121d3-b217-4eba-8725-ba7ddc861335)
Figure 12: Mentor homepage with various sections. The main section has the Confirmed Sessions that the Mentor has with their Mentee(s) with the dates, times, session types, and topics. The Mentors are also presented with a Feedback section where they can view the feedback given by their mentee(s) to them. To the right of that, the Mentor can see the suggested schedules that Gemini-2.0-Flash creates for both the Mentor and Mentee. The Mentor can pick some of them and add them to the calendar or not. 

![image18](https://github.com/user-attachments/assets/a6015be1-01fe-4cf9-a49c-ff84f067f532)
Figure 13: Edit button is clicked and the Mentor can remove some of the Confirmed Sessions should they wish to do so. 

![image29](https://github.com/user-attachments/assets/a63ee6ca-e460-40da-9023-88253c36de7e)
Figure 14: Add button is clicked and this modal pops up, prompting the user to create a new user to go into the Confirmed Sessions section. 

![image30](https://github.com/user-attachments/assets/5f0f7dd4-f27a-441e-a983-d7d62951241f)
Figure 15: Clicking Mentee Information makes this popup appear. The Mentor can select any one of their Mentee(s).

![image28](https://github.com/user-attachments/assets/5250caca-133d-4483-9cf3-d97a5ef3b7fa)
Figure 16: Clicking on a specific Mentee provides all the Mentee information they inputted when they made their account (minus their password of course). There’s also a button to add feedback to that particular Mentee. 

![image25](https://github.com/user-attachments/assets/937b9615-c612-4f1f-914a-a0304e72183c)
Figure 17: Clicking on Add Feedback makes the following feedback popup appear where the Mentor can give the Mentee a feedback score and some comments as to why that score was given. 

![image7](https://github.com/user-attachments/assets/7aebadb5-1673-4e87-8fad-dcb0b110f3a8)
Figure 18: Mentor Progress Reports page with a filter on the top right to sort by date created or report ID. There’s also a button on the bottom right for if the Mentor wants to create a report for a particular Mentee. 

![image8](https://github.com/user-attachments/assets/84202d53-0b9a-4b1d-b724-e81a49dad66b)
Figure 19: Mentor Progress Report modal appearing when clicking on the report on the Progress Reports page. 

![image24](https://github.com/user-attachments/assets/0c6898be-48d5-4228-a1b2-7d5ec57c40b0)
Figure 20: Form that the Mentor fills out when clicking the ‘+’ button on the bottom right. The Mentor can select from a dropdown of Mentees and fill in appropriate fields for areas of improvement, skills improved, and challenges for their Mentees. 

![image31](https://github.com/user-attachments/assets/20c67fad-0bc7-4176-9972-06bdd5102646)
Figure 21: Modal popup which appears when clicking the ‘+’ button and selecting ‘Video’ as the resource type. One will be prompted with a YouTube link for the video. 

![image38](https://github.com/user-attachments/assets/2cf54fe0-e15d-499f-bed5-4660df78ba4b)
Figure 22: Modal popup which appears when clicking the ‘+’ button and selecting ‘Article’ as the resource type. One will be prompted with a description (or article content) for the article.

![image15](https://github.com/user-attachments/assets/b74aa742-00f1-4679-af2c-b1644c5736cd)
Figure 23: Mentor profile page with all attributes shown. Same functionality as with Admin. 

![image1](https://github.com/user-attachments/assets/107056ac-6935-44e7-a2de-9d0e6d2f3f8c)
Figure 24: Mentee login modal. 

![image33](https://github.com/user-attachments/assets/cdb2ba15-77ad-4302-a87a-1ae771b3b653)
Figure 25: Mentee homepage dashboard with Confirmed Sessions, Mentor Information, Potential Sessions, and Feedback. Same functionality as described with Mentor. Only difference is that the Feedback isn’t conjoined with Mentor Information and that’s because a Mentor could be matched with multiple Mentees (adds complexity when giving feedback to just one Mentee). With a Mentee, since they’ve only got one Mentor, the Feedback is much simpler. They can give feedback to their Mentor or view the feedback that the Mentor gives them. 

![image27](https://github.com/user-attachments/assets/1b93f7ea-38fa-4e25-b415-6919d440681a)
Figure 26: Mentee Progress Reports page. Mentees can only view Progress Reports made by the Mentor; they can’t make reports of their own. 

![image4](https://github.com/user-attachments/assets/325e865c-4b2b-401b-962c-27251cec915f)
Figure 27: Mentee Resources page. Same functionality as the Mentor Resources page. Any Resources that a Mentee makes will show up in My Resources and in Mentee Resources and/or Videos (in the current session, anyways). 

![image16](https://github.com/user-attachments/assets/8ce91b9f-529c-464c-a306-9afc3cb2eb44)
Figure 28: Mentee profile page. 

---




   
