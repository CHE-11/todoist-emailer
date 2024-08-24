
# Todoist Emailer
A simple emailer that sends you a daily email with your todoist tasks. I use this to send me a morning and evening email with my todoist tasks so I can see what I need to do in the morning and then the plan for the next day. 

<img src="https://ce-projects-object-storage.sfo2.digitaloceanspaces.com/todoist-emailer/dark-grouped.png" alt="Email Screenshot" width="400"/>


## Setup
1. Clone the repo
2. Get a [Todoist API Key](https://developer.todoist.com/app) from your Todoist account  Sign into your account and head to Settings ➜ Integrations ➜ Developer Tab on top ➜ API Key
3. Get a [Plunk API Key](https://www.plunk.com/pricing) (or change the sendEmail function to use your own email provider)
4. Create a .env file in the root directory of the project with the following variables:
   
```env
TODOIST_API_KEY=your_todoist_api_key
EMAIL_API_KEY=your_email_api_key

# Config for Email
TO_EMAIL_ADDRESS=your_email@gmail.com
FROM_EMAIL_ADDRESS=your_email@gmail.com
SUBJECT_FOR_NIGHTLY_EMAIL=Todoist Nightly Email
SUBJECT_FOR_MORNING_EMAIL=Todoist Morning Email
PREVIEW_TEXT_FOR_MORNING_EMAIL=This is the preview text for the morning email
PREVIEW_TEXT_FOR_NIGHTLY_EMAIL=This is the preview text for the nightly email
LINK_TO_EMAIL_IMAGE=https://example.com/email-image.png
SHOW_TODOIST_DATE_DESCRIPTION_STRING=false
SHOW_DAYS_UNTIL_EVENT=true
USE_DARK_MODE_MORNING=false
USE_DARK_MODE_NIGHTLY=false
TIMEZONE=America/Los_Angeles

# Config for Todoist
ONLY_USE_TASKS_WITH_DUE_DATES=true
INCLUDE_PAST_DUE_TASKS=true
SHOW_PROJECTS_WITH_NO_TASKS=true
USE_24_HOUR_TIME=false
GROUP_TASKS_BY_PROJECT=true
```

4. Run `npm install` to install the dependencies
5. Use ts-node to run the script: `ts-node src/config/getMyProjects.ts`
6. Take the output of the script and put it into the format of IMyProject[] in the projects.ts file. Disable any projects you don't want to include in the email. Also set the number of days to include in the future for each project for both the morning and nightly emails. (If you add a new project and forget to add it to the config, it will show in the email that a new project has been added to Todoist with its name and project id.)
7. Use ts-node to run the script: `ts-node src/main.ts`
8. You should receive an email with your todoist data!

## Email Template
The email template is in the emails/EmailTemplate.tsx file. To change the styling of the email, change the styles.ts file in the same directory. To change the layout, change the EmailTemplate.tsx file.

## Running on a schedule
To run the script on a schedule, there are two main options: 
You can run the .bat script in the main directory of the project called `run.bat` then run it from a task scheduler.

```
@echo off
ts-node src/main.ts
```

The second option is to use a package *like* [node-schedule](https://www.npmjs.com/package/node-schedule) to run the script at a specific time. This way, you can put the program on a server and run it on a schedule. This is the better option if you want it to be more reliable and not rely on a task scheduler/you computer being on.

---
## Dark Mode vs Light Mode
I have two color themes for the email to best fit your desires. You can also change the theme for morning or nightly emails. 

<div>
  <img src="https://ce-projects-object-storage.sfo2.digitaloceanspaces.com/todoist-emailer/dark-grouped.png" alt="Dark Mode" width="400"/>
  <img src="https://ce-projects-object-storage.sfo2.digitaloceanspaces.com/todoist-emailer/light-grouped.png" alt="Light Mode" width="400"/>
</div>


---

## Todoist Config Options
The email config options are pretty self explanatory, but the todoist config options are a little more complicated. 

### ONLY_USE_TASKS_WITH_DUE_DATES
This is a boolean option that determines if you want to include tasks that have only a due date. Otherwise, it will include all tasks.

### INCLUDE_PAST_DUE_TASKS
This is a boolean option that determines if you want to include tasks that have a due date that has already passed.

### DAYS_TO_INCLUDE_IN_FUTURE
This is an integer option that determines how many days into the future you want to include tasks. For example, if you set this to 7, then it will include tasks that are due in the next 7 days. 

### SHOW_PROJECTS_WITH_NO_TASKS
This is a boolean option that determines if you want to show projects that have no tasks. If this is set to true and the project has no upcoming tasks, a header will show in the email but there will be no tasks under the header. 

### USE_24_HOUR_TIME
This is a boolean option that determines if you want to use 24 hour time in the email.

### GROUP_TASKS_BY_PROJECT
This is a boolean option that determines if you want to group tasks by project or just list them all together. This can be useful if you have a lot of tasks with dates assigned and you want to see them all in order. 

<div >
  <img src="https://ce-projects-object-storage.sfo2.digitaloceanspaces.com/todoist-emailer/dark-ungrouped.png" alt="Email Screenshot" width="400"/> 
  <img src="https://ce-projects-object-storage.sfo2.digitaloceanspaces.com/todoist-emailer/dark-grouped.png" alt="Email Screenshot" width="400"/>
</div>

---
## Known Issues
1. Todoist tasks are given a due datetime of the current date at 12am or 0:00 in 24-hour time. To not show the time, I have the script check if the hour is 12:00 AM or 0:00 AM and if so, it will not show the time. This is a bit of a hack, but it works for now. I just assume I won't have tasks that are due at midnight.
