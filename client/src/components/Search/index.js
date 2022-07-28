import React, { useState } from 'react'
import { AppBar, Button, Grid, Paper, Toolbar, Typography, TextField, CssBaseline } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import theme from '../Theme';

//const serverURL = "";
const serverURL = "http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3040";

const opacityValue = 0.9;

const styles = theme => ({
	root: {
		body: {
			backgroundColor: "#000000",
			opacity: opacityValue,
			overflow: "hidden",
		},
	},
	paper: {
		overflow: "hidden",
	},
	mainArea: {
		paddingTop: "15vh",
		marginLeft: theme.spacing(20),
	},
	movieResult: {
		margin: "10px, 10px, 10px, 10px",
		minHeight: '8rem'
	},
	navBar: {
		minHeight: '5vh'
	}
});

const linkStyle = {
	textDecoration: 'none',
	color: 'inherit',
	cursor: 'pointer'
}

const Search = ({ classes }) => {

	const [movieTitle, setMovieTitle] = useState('')
	const [director, setDirector] = useState('')
	const [actor, setActor] = useState('')

	const [searched, setSearched] = useState(false)

	const [searchResults, setSearchResults] = useState([])

	const changeMovieTitle = (event) => { setMovieTitle(event.target.value); }
	const changeDirector = (event) => { setDirector(event.target.value); }
	const changeActor = (event) => { setActor(event.target.value); }

	const submitSearch = async () => {
		const host = (serverURL || 'http://localhost:5000') + '/api/search'

		const data = {
			title: movieTitle,
			director: director,
			actor: actor,
		}

		const response = await fetch(host, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})

		const results = await response.json()
		setSearchResults(results)
		setSearched(true)
	}

	const navBar = (
		<AppBar position='static' className={classes.navBar}>
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
						to={'/reviews'}
						style={linkStyle}
					>
						<Typography variant='h4'>Reviews</Typography>
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

	const searchForm = (
		<Grid
			container
			direction='column'
			className={classes.mainArea}
		>
			<Typography
				variant={"h3"}
				align="left"
			>
				Search for Movies
			</Typography>
			<Grid item>
				<TextField
					id='movie-title-textfield'
					label='Movie Title'
					inputProps={{ maxLength: 200 }}
					onChange={changeMovieTitle}
				/>
			</Grid>
			<Grid item>
				<TextField
					id='director-textfield'
					label='Director'
					inputProps={{ maxLength: 200 }}
					onChange={changeDirector}
					helperText={'First_Name Last_Name'}
				/>
			</Grid>
			<Grid item>
				<TextField
					id='actor-textfield'
					label='Actor'
					inputProps={{ maxLength: 200 }}
					onChange={changeActor}
					helperText={'First_Name Last_Name'}
				/>
			</Grid>
			<Grid item>
				<Button onClick={submitSearch}>
					SEARCH
				</Button>
			</Grid>

			<Typography>{searched && searchResults.length + ' results'}</Typography>

			<Grid item container md={10}>
				{
					searchResults.map(e => (
						<Grid item md={4} key={e.movie_id}>
							<Paper key={e.movie_id} className={classes.movieResult} style={{ margin: '10px' }}>
								<Typography variant='h6'>{e.title}</Typography>
								<Typography variant='subtitle2'>Directed by {e.director}</Typography>
								{e.reviews.split('\n\n').map(r => {
									return (<Typography key={e.title + r} variant='body2'>{r}</Typography>)
								}
								)}
								<Typography color='textSecondary'>{e.avg_score ? e.avg_score + '/5' : 'No Reviews Available'}</Typography>
							</Paper>
						</Grid>
					))
				}
			</Grid>

		</Grid>
	)

	return (
		<MuiThemeProvider theme={theme}>
			<div className={classes.root}>
				<CssBaseline />
				<Paper className={classes.paper}
					style={{ minHeight: '100vh' }
					}>
					{navBar}
					{searchForm}
				</Paper>
			</div>
		</MuiThemeProvider>
	)
}

export default withStyles(styles)(Search)