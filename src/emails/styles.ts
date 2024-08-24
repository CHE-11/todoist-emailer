const isNightly = new Date().getHours() >= 12 ? true : false;
const useDarkMode = isNightly ? process.env.USE_DARK_MODE_NIGHTLY === 'true' : process.env.USE_DARK_MODE_MORNING === 'true';

export const main = {
  backgroundColor: useDarkMode ? "black" : "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  marginTop: '20px'
};

export const mainContainer = {
  backgroundColor: useDarkMode ? "black" : "white",
  margin: "0 auto",
  padding: "20px 0 20px",
  marginBottom: "64px",
  borderRadius: "10px",
};

export const box = {
  padding: "0 10px",
};

export const logo = {
  width: "50px",
  height: "50px",
  borderRadius: "7.5px",
};

export const mainHeader = {
  fontSize: "20px",
  lineHeight: "28px",
  fontWeight: "bold",
  margin: "10px 0 16px",
  color: useDarkMode ? "white" : "black",
};

export const date = {
  fontSize: "12px",
  lineHeight: "0px",
  margin: "0",
  color: useDarkMode ? "white" : "black",
  fontWeight: "bold",
};

export const newProjectText = {
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
  color: useDarkMode ? "white" : "black",
  fontWeight: "bold",
  textAlign: "left" as const,
};

export const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

export const projectHeader = {
  fontSize: "18px",
  lineHeight: "28px",
  fontWeight: "bold",
  margin: "0 0 5px",
  color: useDarkMode ? "white" : "black",
}

export const taskLink = {
  color: "unset",
};

export const tasksListContainer = {
  margin: "0 0 5px",
};

export const taskStyle = {
  border: "1px solid #e6ebf1",
  padding: "5px 10px",
  marginTop: "2.5px",
  borderRadius: "5px",
}

export const taskTitle = {
  fontSize: "12px",
  margin: "0",
  color: useDarkMode ? "white" : "black",
  textAlign: "left" as const,
  fontWeight: "600",
  lineHeight: "16px",

}

export const taskDescription = {
  fontSize: "11px",
  textAlign: "left" as const,
  margin: "0",
  lineHeight: "18px",
  color: useDarkMode ? "white" : "black",
}

export const projectInTask = {
  fontSize: "10px",
  textAlign: "left" as const,
  margin: "5px 0 5px 0 ",
  lineHeight: "0px",
  textDecoration: "underline" as const,
  color: useDarkMode ? "white" : "black",
}

export const datesColumn = {
  display: "flex" as const,
  flexDirection: "column" as const,
  justifyContent: "flex-end" as const,
}

export const taskDue = {
  fontSize: "11px",
  textAlign: "right" as const,
  margin: "0",
  lineHeight: "18px",
  minWidth: "150px",
}

export const pastDue = {
  ...taskDue,
  fontWeight: "bold",
}

export const taskDueString = {
  fontSize: "11px",
  textAlign: "right" as const,
  margin: "0",
  lineHeight: "18px",
}

export const daysUntilEventStyle = {
  fontSize: "11px",
  textAlign: "right" as const,
  margin: "0",
  lineHeight: "18px",
}


export const p = {
  fontSize: "12px",
  lineHeight: "32px",
  margin: "0",
  marginBottom: "-10px",
  color: useDarkMode ? "white" : "black",
};

export const boldP = {
  ...p,
  fontWeight: "bold",
}

export const end = {
  fontSize: "11px",
  margin: "0",
  color: "grey",
  fontStyle: "italic",
  textAlign: "center" as const,
  lineHeight: "18px",
  marginTop: "20px" as const,
}
