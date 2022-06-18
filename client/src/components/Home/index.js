import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createTheme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  CssBaseline, 
  Fade, 
  FormControl, 
  FormControlLabel, 
  FormHelperText, 
  FormLabel, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Radio, 
  RadioGroup, 
  Select, 
  TextField, 
  Typography
} from '@material-ui/core';


//Dev mode
const serverURL = ""; //enable for dev mode

//Deployment mode instructions
//const serverURL = "http://ov-research-4.uwaterloo.ca:3040"; //enable for deployed mode; Change PORT to the port number given to you;
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
    paddingTop: "20vh",
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
  formControl: {
    minWidth: 100,
  }

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
        justifyContent="flex-start"
        alignItems="flex-start"
        style={{ minHeight: '100vh' }}
        className={classes.mainMessageContainer}
      >
        <Review classes={classes}/>
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


const Review = ({classes}) => {

  // Set up states
    // Movie States
  const [selectedMovie, setSelectedMovie] = useState('')
  const [movieError, setMovieError] = useState(false)
    // Title States
  const [enteredTitle, setEnteredTitle] = useState('')
  const [titleError, setTitleError] = useState(false)
    // Review Body states
  const [enteredReview, setEnteredReview] = useState('')
  const [reviewError, setReviewError] = useState(false)
    // Rating states
  const [selectedRating, setSelectedRating] = useState(0)
  const [ratingError, setRatingError] = useState(false)

  const [submission, setSubmission] = useState({
    shown: false, //Has been submitted
    current: false, //Submission matches current input
    movie: '',
    title: '',
    body: '',
    rating: 0,
  })

  // Set up state updating
  const changeMovie = (event) => { setSelectedMovie(event.target.value); }
  const changeTitle = (event) => { setEnteredTitle(event.target.value) }
  const changeBody = (event) => { setEnteredReview(event.target.value) }
  const changeRating = (event) => { setSelectedRating(Number(event.target.value)) }

  // Removes submission message on input change
  useEffect(() => {
    detectChange()
  }, [selectedMovie, enteredTitle, enteredReview, selectedRating])
  
  // Check for differences in input and submission
  // Remove submission message if different
  const detectChange = () => {
    !(
      submission.shown === true &&
      submission.movie === selectedMovie &&
      submission.title === enteredTitle &&
      submission.body === enteredReview &&
      submission.rating === selectedRating
    )
    && setSubmission({...submission, current: false})
  }

  // Submit button press
  const submit = (event) => {
    validateAll() && //If valid, set submission to input
    setSubmission({
      state: true,
      current: true,
      movie: selectedMovie,
      title: enteredTitle,
      body: enteredReview,
      rating: selectedRating,
    })
  }

  // Validation and error state setting

  const validateAll = () => {
    // Validation clauses
    // Call all clauses
    let bool = validateMovieTitle()
    bool =  validateReviewTitle() && bool
    bool =  validateReviewBody() && bool
    bool =  validateRating() && bool
    return bool
  }

  const validateMovieTitle = () => {
    //Check if movie title empty
    return (selectedMovie) ? errorMovieTitle(true) : errorMovieTitle(false)
  }

  const errorMovieTitle = (bool) => {
    setMovieError(!bool)
    return bool
  }

  const validateReviewTitle = () => {
    //Check if review title empty
    return (enteredTitle) ? errorReviewTitle(true) : errorReviewTitle(false)
  }

  const errorReviewTitle = (bool) => {
    setTitleError(!bool)
    return bool
  }

  const validateReviewBody = () => {
    //Check if review title empty
    return (enteredReview) ? errorReviewBody(true) : errorReviewBody(false)
  }

  const errorReviewBody = (bool) => {
    setReviewError(!bool)
    return bool
  }

  const validateRating = () => {
    //Check if review title empty
    return (selectedRating) ? errorRating(true) : errorRating(false)
  }

  const errorRating = (bool) => {
    setRatingError(!bool)
    return bool
  }

  return (
    <Grid
      container
      direction="row"
    >
      <Grid 
        item
        container
        xs={12}
        md={5}
        spacing={1}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          variant={"h3"}
          align="left"
        >
          Review a Movie
        </Typography>
        <MovieSelection
          movie={selectedMovie} 
          onChange={changeMovie} 
          errorState={movieError}
          classes={classes}
        />
        <ReviewTitle
          onChange={changeTitle}
          errorState={titleError}
        />
        <ReviewBody
          onChange={changeBody}
          errorState={reviewError}
        />
        <ReviewRating
          rating={selectedRating}
          onChange={changeRating}
          errorState={ratingError}
        />
        <Button onClick={submit}>
          Submit
        </Button>
        <Fade in={submission.current}>
          <Typography variant="h5">Your review has been received!</Typography>
        </Fade>

      </Grid>
      <Grid item xs={1}/>
      <Grid
        item
        container
        xs={12}
        md={4}
        direction='column'
      >
        {submission.state &&(// Submission display
          <Fade in={submission.shown}>
            <>
              <Typography variant="h4">{submission.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">Review for the movie {submission.movie}</Typography>
              <Typography variant="body1">{submission.body}</Typography>
              <Typography color='textSecondary'>Rating:  {submission.rating}/5</Typography>              
            </>
          </Fade>
          )
        }
      </Grid>
    </Grid>
  )
}

// Movie selection drop-down menu
const MovieSelection = ({ movie, onChange, errorState, classes }) => {
  return (
    <FormControl error={errorState} className={classes.formControl}>
      <InputLabel id="movie-title-label">Movie Title</InputLabel>
      <Select
        labelid="movie-title-label"
        id="movie-title-input"
        value={movie}
        onChange={onChange}
      >
        <MenuItem value={"Avatar"}>Avatar</MenuItem>
        <MenuItem value={"Die Hard"}>Die Hard</MenuItem>
        <MenuItem value={"Morbius"}>Morbius</MenuItem>
        <MenuItem value={"Shrek"}>Shrek</MenuItem>
        <MenuItem value={"The Minions"}>The Minions</MenuItem>
      </Select>
      <FormHelperText>
        {errorState 
        ? 'Please select a movie title' 
        : 'Select a movie to review'}
      </FormHelperText>
    </FormControl>
  )
}

MovieSelection.propTypes = {
  movie: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorState: PropTypes.bool.isRequired
}

// Review title single-line text-field
const ReviewTitle = ({onChange, errorState}) => {
  return (
    <TextField 
      id='review-title-textfield'
      label='Review Title'
      onChange={onChange}
      error={errorState} 
      helperText={errorState 
        ? 'Please enter your review title' 
        : 'Enter a title for your review here'}
      />
  )
}

ReviewTitle.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorState: PropTypes.bool.isRequired
}

// Review body multi-line text-field
const ReviewBody = ({onChange, errorState}) => {
  return (
    <TextField
      label="Review Body"
      multiline
      minRows={3}
      fullWidth
      inputProps={{maxLength: 200}}
      onChange={onChange}
      error={errorState}
      helperText={errorState 
        ? 'Please enter your review' 
        : 'Write your review here (max 200 characters)'}
    />
  )
}

ReviewBody.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorState: PropTypes.bool.isRequired
}

// Review rating radio buttons
const ReviewRating = ({rating, onChange, errorState}) => {
  return (
    <FormControl error={errorState}>
      <FormLabel>Rating</FormLabel>
      <RadioGroup
        row
        value={rating}
        onChange={onChange}
      >
        <FormControlLabel
          value={1}
          control={<Radio/>}
          label={1}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={2}
          control={<Radio/>}
          label={2}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={3}
          control={<Radio/>}
          label={3}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={4}
          control={<Radio/>}
          label={4}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={5}
          control={<Radio/>}
          label={5}
          labelPlacement='bottom'
        />
      </RadioGroup>
      <FormHelperText>
        {errorState 
        ? 'Please enter your rating' 
        : 'Select a rating for the movie'}
      </FormHelperText>
    </FormControl>
    
  )
}

ReviewRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  errorState: PropTypes.bool.isRequired
}

export default withStyles(styles)(Home);
