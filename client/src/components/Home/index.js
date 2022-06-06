import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createTheme, withStyles } from "@material-ui/core/styles";
import { 
  CssBaseline, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  TextField, 
  Typography
} from '@material-ui/core';


//Dev mode
const serverURL = ""; //enable for dev mode

//Deployment mode instructions
//const serverURL = "http://ov-research-4.uwaterloo.ca:PORT"; //enable for deployed mode; Change PORT to the port number given to you;
//To find your port number: 
//ssh to ov-research-4.uwaterloo.ca and run the following command: 
//env | grep "PORT"
//copy the number only and paste it in the serverURL in place of PORT, e.g.: const serverURL = "http://ov-research-4.uwaterloo.ca:3000";

const fetch = require("node-fetch");

const opacityValue = 0.9;

const theme = createTheme({
  palette: {
    type: 'dark',
    background: {
      default: "#000000"
    },
    primary: {
      main: "#52f1ff",
    },
    secondary: {
      main: "#b552f7",
    },
  },
});

const styles = theme => ({
  root: {
    body: {
      backgroundColor: "#000000",
      opacity: opacityValue,
      overflow: "hidden",
    },
  },
  mainMessage: {
    opacity: opacityValue,
  },

  mainMessageContainer: {
    marginTop: "20vh",
    marginLeft: theme.spacing(20),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(4),
    },
  },
  paper: {
    overflow: "hidden",
  },
  message: {
    opacity: opacityValue,
    maxWidth: 250,
    paddingBottom: theme.spacing(2),
  },

});


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1,
      mode: 0
    }
  };

  componentDidMount() {
    //this.loadUserSettings();
  }


  loadUserSettings() {
    this.callApiLoadUserSettings()
      .then(res => {
        //console.log("loadUserSettings returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("loadUserSettings parsed: ", parsed[0].mode)
        this.setState({ mode: parsed[0].mode });
      });
  }

  callApiLoadUserSettings = async () => {
    const url = serverURL + "/api/loadUserSettings";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        userID: this.state.userID
      })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("User settings: ", body);
    return body;
  }

  render() {
    const { classes } = this.props;



    const mainMessage = (
      <Grid
        container
        spacing={0}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        style={{ minHeight: '100vh' }}
        className={classes.mainMessageContainer}
      >
        <Grid item>

          <Typography
            variant={"h3"}
            className={classes.mainMessage}
            align="flex-start"
          >
            {this.state.mode === 0 ? (
              <React.Fragment>
                Welcome to MSci245!
              </React.Fragment>
            ) : (
              <React.Fragment>
                Welcome back!
              </React.Fragment>
            )}
            <Review/>
          </Typography>
        </Grid>
      </Grid>
    )


    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <Paper
            className={classes.paper}
          >
            {mainMessage}
          </Paper>

        </div>
      </MuiThemeProvider>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};


const Review = (props) => {

  // Set up states
  const [selectedMovie, setSelectedMovie] = useState("")
  const [enteredTitle, setEnteredTitle] = useState("")
  const [enteredReview, setEnteredReview] = useState("")
  const [selectedRating, setSelectedRating] = useState(0)

  // Set up state updating
  const changeMovie = (event) => { setSelectedMovie(event.target.value) }

  // Submit button press
  const submit = (event) => { setSelectedMovie(event.target.value) }

  // Validation
  const validateAll = () => {
    // Validation clauses
    return true //TODO && validation1 && Validation2...
  }

  return (
    <Grid 
    item
    container
    spacing={0}
    direction="column"
    justify="flex-start"
    alignItems="flex-start"
    >
      <Typography
        variant={"h3"}
        align="flex-start"
      >
        Review a Movie
      </Typography>
      <MovieSelection movie={selectedMovie} onChange={changeMovie}/>
      <ReviewTitle/>
      <ReviewBody/>
      <ReviewRating/>
    </Grid>
  )
}

// TODO Styling
const MovieSelection = ({ movie, onChange }) => {
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">Movie Title</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={movie}
        onChange={onChange}
      >
        <MenuItem value={"Avatar"}>Avatar</MenuItem>
        <MenuItem value={"Die Hard"}>Die Hard</MenuItem>
        <MenuItem value={"Morbius"}>Morbius</MenuItem>
        <MenuItem value={"Shrek"}>Shrek</MenuItem>
        <MenuItem value={"The Minions"}>The Minions</MenuItem>
      </Select>
    </FormControl>
  )
}

// Placeholders
const ReviewTitle = () => {
  return (
    <div>ReviewTitle</div>
  )
}

const ReviewBody = () => {
  return (
    <div>ReviewBody</div>
  )
}

const ReviewRating = () => {
  return (
    <div>ReviewRating</div>
  )
}

export default withStyles(styles)(Home);
