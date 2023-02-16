import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
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
  Typography,
  AppBar,
  Toolbar
} from '@material-ui/core';
import theme from '../Theme';


//Dev mode / Deploy mode
const serverURL = ""; //enable for dev mode
//const serverURL = "http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3040";


const fetch = require("node-fetch");

const opacityValue = 0.9;

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
    paddingTop: "15vh",
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

const linkStyle = {
	textDecoration: 'none',
	color: 'inherit',
	cursor: 'pointer'
}


class Reviews extends Component {
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
        className={classes.mainMessageContainer}
      >
        <Review classes={classes} />
      </Grid>
    )
    const navBar = (
      <AppBar position='static'>
        <Toolbar>
          {/*Logo*/}
          <Button color='inherit'>
            <Link
              to={'/'}
              style={linkStyle}
            >
              <Typography variant='h4'>Landing</Typography>
            </Link>
          </Button>
          <Button color='inherit'>
            <Link
              to={'/search'}
              style={linkStyle}
            /*onClick={()=>history.push('/search')}*/
            >
              <Typography variant='h4'>Search</Typography>
            </Link>
          </Button>
          <Button color='inherit'>
            <Link
              to={'/recommendations'}
              style={linkStyle}
            >
              <Typography variant='h4'>Recommendations</Typography>
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    )


    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <Paper
            style={{ minHeight: '100vh' }}
            className={classes.paper}
          >
            {navBar}
            {mainMessage}
          </Paper>

        </div>
      </MuiThemeProvider>
    );
  }
}

Reviews.propTypes = {
  classes: PropTypes.object.isRequired
};


const Review = ({ classes }) => {

  const [userID, setUserID] = useState(1)

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
    movieID: null,
    movie: {},
    title: '',
    body: '',
    rating: 0,
  })

  const [movies, setMovies] = useState([])

  const fetchMovies = async () => {
    // TODO Fetch movie list
    const host = (serverURL || 'http://localhost:5000') + '/api/getMovies'
    const response = await fetch(host, {
      method: 'POST'
    })

    const results = await response.json()

    setMovies(await results)
  }

  const postReview = async () => {

    const host = (serverURL || 'http://localhost:5000') + '/api/addReview'

    // Prep data to POST
    const data = {
      reviewTitle: enteredTitle,
      reviewContent: enteredReview,
      reviewScore: selectedRating,
      userID: userID,
      movieID: Number(selectedMovie)
    }
    // console.log('addReview API POST data: ', data)

    // POST data
    const response = await fetch(host, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (await result.message === 'success') { return true }

    console.error(`Server side error: ${result.message}`)
    return false

  }

  useEffect(() => {
    fetchMovies()
  }, [])


  // Set up state updating
  const changeMovie = (event) => { setSelectedMovie(event.target.value); }
  const changeTitle = (event) => { setEnteredTitle(event.target.value) }
  const changeBody = (event) => { setEnteredReview(event.target.value) }
  const changeRating = (event) => { setSelectedRating(Number(event.target.value)) }

  const findMovie = (id) => movies.find(item => item.id === Number(id))

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
      && setSubmission({ ...submission, current: false })
  }

  // Submit button press
  const submit = async (event) => {
    validateAll() && //If valid, set submission to input
      await postReview() &&
      setSubmission({
        state: true,
        current: true,
        movieID: selectedMovie,
        movie: findMovie(selectedMovie),
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
    bool = validateReviewTitle() && bool
    bool = validateReviewBody() && bool
    bool = validateRating() && bool
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
          movies={movies}
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
      <Grid item xs={1} />
      <Grid
        item
        container
        xs={12}
        md={4}
        direction='column'
      >
        {submission.state && (// Submission display
          <Fade in={submission.shown}>
            <>
              <Typography variant="h4">{submission.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">Review for the movie {submission.movie.name} ({submission.movie.year})</Typography>
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
const MovieSelection = ({ movie, onChange, errorState, classes, movies }) => {
  return (
    <FormControl error={errorState} className={classes.formControl}>
      <InputLabel id="movie-title-label">Movie Title</InputLabel>
      <Select
        labelid="movie-title-label"
        id="movie-title-input"
        value={movie}
        onChange={onChange}
      >
        {
          // TODO Populate with list from "movies" state
          (movies.map((e) => <MenuItem key={e.id} value={String(e.id)}>{e.name} ({e.year})</MenuItem>))
        }
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
const ReviewTitle = ({ onChange, errorState }) => {
  return (
    <TextField
      id='review-title-textfield'
      label='Review Title'
      inputProps={{ maxLength: 200 }}
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
const ReviewBody = ({ onChange, errorState }) => {
  return (
    <TextField
      label="Review Body"
      multiline
      minRows={3}
      fullWidth
      inputProps={{ maxLength: 200 }}
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
const ReviewRating = ({ rating, onChange, errorState }) => {
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
          control={<Radio />}
          label={1}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={2}
          control={<Radio />}
          label={2}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={3}
          control={<Radio />}
          label={3}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={4}
          control={<Radio />}
          label={4}
          labelPlacement='bottom'
        />
        <FormControlLabel
          value={5}
          control={<Radio />}
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

export default withStyles(styles)(Reviews);
