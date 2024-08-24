
import { Body, Column, Container, Head, Hr, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from "@react-email/components";
import * as React from "react";
import { boldP, date, datesColumn, daysUntilEventStyle, end, hr, logo, main, mainContainer, mainHeader, newProjectText, pastDue, projectHeader, projectInTask, taskDescription, taskDue, taskDueString, taskLink, tasksListContainer, taskStyle, taskTitle } from "./styles";
import { IMyTodoistData } from "../types/IMyTodoistData";
import { ITodoistTask } from "../types/ITodoistTask";
import { ITodoistProject } from "../types/ITodoistProject";
import { generateMockProjects } from "./faker/fakeProjectData";
import fakeEmailData from "./faker/fakeEmailData";
import dayjs from 'dayjs';

interface Props {
  data: IMyTodoistData[];
  projectsNotInConfig: ITodoistProject[];
  isNightly: boolean;
}

EmailTemplate.PreviewProps = {
  data: fakeEmailData(10),
  projectsNotInConfig: generateMockProjects(0),
  isNightly: true,
} as Props;

function formatDatetime(date: string | undefined, datetime: string | undefined, timezone: string | undefined): string {
  let useDate = datetime || date;
  if (!useDate) return "";

  // Assuming the useDate string might not include a timezone, parse it in UTC if a timezone is not specified
  const dateTime = new Date(useDate + (useDate.endsWith('Z') ? '' : 'Z'));

  const use24HourTime = process.env.USE_24_HOUR_TIME === 'true';
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24HourTime,
    timeZone: timezone || 'UTC' // Defaulting to UTC if timezone is not specified
  };

  // Format the date using the specified or default timezone
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateTime);

  // Extract parts for custom formatting if needed
  const [monthDay, year, time] = formattedDate.split(', ');
  const [month, day] = monthDay.split(' ');
  const [hour, minute] = time.split(':');
  const [minutes, amPm] = minute.split(' ');

  // Adjusting the formatted output to desired format
  const shortDayName = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: timezone || 'UTC' }).format(dateTime);

  let returnDate = "";

  // If the hour is 12:00 AM, then do not show the @ ...
  if ((!use24HourTime && hour === '12' && minutes === '00') || (use24HourTime && hour === '00' && minutes === '00')) {
    returnDate = `${shortDayName} ${month} ${day.trim()}, ${year} ${timezone ? timezone : ""}`;
  }else{
    returnDate = `${shortDayName} ${month} ${day.trim()}, ${year} @ ${hour}:${minute} ${timezone ? timezone : ""}`;
  }

  // console.log("useDate", useDate, "-> DateTime:", `${returnDate}`);
  return returnDate;
}

function findDaysUntilEvent(task: ITodoistTask): number {
  let timezone = task.due?.timezone ? task.due.timezone : process.env.TIMEZONE ? process.env.TIMEZONE : 'UTC';

  // Create an instance of current date adjusted to the specified timezone
  const currentDate = new Date();
  const currentDateTimezone = new Date(currentDate.toLocaleString('en-US', { timeZone: timezone }));
  const timezoneOffset = timezone === "UTC" ? 0 : currentDateTimezone.getTimezoneOffset();
  currentDateTimezone.setMinutes(currentDateTimezone.getMinutes() - timezoneOffset);

  const currentYear = currentDateTimezone.getFullYear();
  const currentMonth = currentDateTimezone.getMonth() + 1;
  const currentDay = currentDateTimezone.getDate();

  const date1 = dayjs(`${currentYear}-${currentMonth}-${currentDay}`);

  // Parse the event date from task, assuming task.due.datetime is the due date in ISO format
  let selectedEventDate 

  if (task.due?.datetime && task.due.datetime.includes("12:00 AM")) {
    selectedEventDate = task.due?.date
  }else if (task.due?.datetime && !task.due.datetime.includes("12:00 PM")) {
    selectedEventDate = task.due?.datetime
  }else {
    selectedEventDate = task.due?.date
  }

  const date2 = dayjs(selectedEventDate);

  const daysUntilEvent = date2.diff(date1, 'day')

  // console.log({
  //   timezone: timezone,
  //   taskName: task.content,
  //   currentDate: `${currentYear}-${currentMonth}-${currentDay}`,
  //   selectedEventDate: `${selectedEventDate}`,
  //   daysUntilEvent: daysUntilEvent
  // });

  return daysUntilEvent;
}

function formatTaskContent(content: string): string {
  // Trying to find any markdown links in the task [](). Just want to remove actual link in the () portion then put LINK ➜ ${text inside []}
  const markdownLinks = content.match(/\[(.*?)\]\((.*?)\)/g);

  if (markdownLinks) {
    markdownLinks.forEach((link) => {
      // Extract the text inside [] and ignore the link inside ()
      const text = link.match(/\[(.*?)\]/)?.[1];
      if (text) {
        // Replace the entire markdown link with the formatted text
        content = content.replace(link, `LINK ➜ ${text}`);
      }
    });
  }
    
  return content
}

function dayColor(daysUntilEvent: number, isDarkMode: boolean): string {

  if (isDarkMode) {
    if (daysUntilEvent < 0)        return '#E5484D';
    else if (daysUntilEvent == 0) return '#E5484D';
    else if (daysUntilEvent == 1) return '#F76B15';
    else if (daysUntilEvent == 2) return '#F5E147';
    else                           return '#53B365';
  }

  if (daysUntilEvent < 0)        return '#E5484D';
  else if (daysUntilEvent == 0) return '#E5484D';
  else if (daysUntilEvent == 1) return '#F76B15';
  else if (daysUntilEvent == 2) return '#F5E147';
  else                           return '#53B365';
}


interface IGroupedTask extends ITodoistTask {
  projectName: string;
}

export default function EmailTemplate({ data, projectsNotInConfig, isNightly }: Props){
  const showProjectsWithNoTasks = process.env.SHOW_PROJECTS_WITH_NO_TASKS === "true";
  const groupTasksByProject = process.env.GROUP_TASKS_BY_PROJECT === "true";
  const showTodoistDateDescriptionString = process.env.SHOW_TODOIST_DATE_DESCRIPTION_STRING === "true";
  const showDaysUntilEvent = process.env.SHOW_DAYS_UNTIL_EVENT === "true";
  const useDarkMode = isNightly ? process.env.USE_DARK_MODE_NIGHTLY === 'true' : process.env.USE_DARK_MODE_MORNING === 'true';


  // Group all tasks from each project together and add the project name to each task
  const allTasks: IGroupedTask[] = data.reduce((acc, project) => {
    // Map each task to include the project name
    const tasksWithProjectName = project.data.map(task => ({
      ...task,
      projectName: project.project_name
    }));

    // Concatenate the modified tasks to the accumulator
    // @ts-ignore
    return acc.concat(tasksWithProjectName);
  }, []);


  return (
    <Html>
      <Head />
      <Preview>{isNightly ? process.env.PREVIEW_TEXT_FOR_NIGHTLY_EMAIL as string : process.env.PREVIEW_TEXT_FOR_MORNING_EMAIL as string}</Preview>
      <Body style={main}>
        <Container style={mainContainer}>
          <Tailwind>
            <head />
            <Section className={useDarkMode ? "p-5 sm:p-1 md:p-10 lg:p-10 xl:p-10 bg-stone-900 rounded " : "p-5 sm:p-1 md:p-10 lg:p-10 xl:p-10 bg-white rounded "}>

              {process.env.LINK_TO_EMAIL_IMAGE && (
                <Img src={process.env.LINK_TO_EMAIL_IMAGE} alt="Email Image" style={logo} />
              )}          
             
              <Text style={mainHeader}>
                Todoist {isNightly ? "Nightly" : "Morning"} Email
              </Text>
              <Text style={date}>
                Current Date: {new Date().toLocaleDateString()}
              </Text>

              {projectsNotInConfig && projectsNotInConfig.length > 0 && (
                <>
                <Hr style={hr} />
                  <Text style={{...boldP, marginBottom: "5px"}}>
                    Projects Added or Removed
                  </Text>
                  {projectsNotInConfig.map(project => (
                    <Text key={project.id} style={newProjectText}>Project Name: {project.name} ➜ Project Id: {project.id}</Text>
                  ))}
                </>
              )}

              <Hr style={hr} />

              {groupTasksByProject && data.map((project: IMyTodoistData) => 
                (showProjectsWithNoTasks || project.data.length > 0) && (
                  <React.Fragment key={project.project_name}>
                    <Text style={projectHeader}>{project.project_name}</Text>
                    <Container style={tasksListContainer} >
                      {project.data.map(task => {
                        const daysUntilEvent = findDaysUntilEvent(task);
                        return (
                        <Link href={task.url} key={task.id} style={taskLink}>
                          <Row style={taskStyle}>
                            <Column >
                              <Text style={taskTitle}>{formatTaskContent(task.content)}</Text>
                              {task.description ? <Text style={taskDescription}>{task.description}</Text> : <Text />}
                            </Column>
                            <Column >
                              {task.due && <Text style={{...task.due.date && new Date(task.due.date) <= new Date() ? pastDue : taskDue, color: useDarkMode ? 'white' : 'black'}}>{formatDatetime(task.due.date, task.due.datetime, task.due.timezone)} </Text>}
                              {showTodoistDateDescriptionString && task.due && <Text style={{...taskDueString, color: useDarkMode ? 'white' : 'black'}}>{task.due.string}</Text>}
                              {task.duration && <Text style={{...taskDueString, color: useDarkMode ? 'white' : 'black'}}>{task.duration.amount} {task.duration.unit}</Text>}
                              {showDaysUntilEvent && task.due && task.due.date && <Text style={{...daysUntilEventStyle, color: dayColor(daysUntilEvent, useDarkMode)}}>{daysUntilEvent} days until event</Text>}
                            </Column>
                          </Row>
                        </Link>
                        )
                      })}
                    </Container>
                    <Hr style={hr} />
                  </React.Fragment>
                )
              )}

              {/* @ts-ignore */}
              {!groupTasksByProject && allTasks.sort((a, b) => new Date(a.due.date) - new Date(b.due.date)).map((task: IGroupedTask) => {
                const daysUntilEvent = findDaysUntilEvent(task);
                return (
                  <React.Fragment key={task.id}>
                    <Link href={task.url} key={task.id} style={taskLink}>
                      <Row style={taskStyle}>
                        <Column>
                          <Text style={taskTitle}>{task.content}</Text>
                          {task.description ? <Text style={taskDescription}>{task.description}</Text> : <Text />}
                          <Text style={projectInTask}>{task.projectName}</Text>
                        </Column>
                        <Column style={datesColumn}>
                          {task.due && <Text style={{...task.due.date && new Date(task.due.date) <= new Date() ? pastDue : taskDue, color: useDarkMode ? 'white' : 'black'}}>{formatDatetime(task.due.date, task.due.datetime, task.due.timezone)} </Text>}
                          {showTodoistDateDescriptionString && task.due && <Text style={{...taskDueString, color: useDarkMode ? 'white' : 'black'}}>{task.due.string}</Text>}
                          {task.duration && <Text style={{...taskDueString, color: useDarkMode ? 'white' : 'black'}}>{task.duration.amount} {task.duration.unit}</Text>}
                          {showDaysUntilEvent && task.due && task.due.date && <Text style={{...daysUntilEventStyle, color: dayColor(daysUntilEvent, useDarkMode)}}>{daysUntilEvent} days until event</Text>}
                          </Column>
                      </Row>
                    </Link>
                  </React.Fragment>
                )
              })}

              {!groupTasksByProject &&  <Hr  style={hr} />}

      
              <Text style={end}>
                End of Todoist Email
              </Text>
          
            </Section>
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
}

