import React, { useState, useEffect } from 'react'
import { AppBar, Button, Grid, Paper, Toolbar, Typography, CssBaseline } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import theme from '../Theme';

const serverURL = "";
//const serverURL = "http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3040";

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

const Recommendations = ({ classes }) => {

	const [recommendationResults, setRecommendationResults] = useState([])
	const [userID, setUserID] = useState(1)

	const getRecommendations = async () => {
		//Fetch
		const host = (serverURL || 'http://localhost:5000') + '/api/recommendations'

		const data = {
			userID: userID
		}

		const response = await fetch(host, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})

		const results = await response.json()
		setRecommendationResults(results)
		console.log(results)

	}

	useEffect(() => {
		console.log('Loaded')
		getRecommendations();
	}, [])
	

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
						to={'/search'}
						style={linkStyle}
					>
						<Typography variant='h4'>Search</Typography>
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
			</Toolbar>
		</AppBar>
	)


	const mainContent = (
		<Grid
			container
			direction='column'
			className={classes.mainArea}
		>
			<Typography
				variant={"h3"}
				align="left"
			>
				Recommendations
			</Typography>
			<Typography variant='body2' color='textSecondary'>
				This page shows recommendations of movies you haven't reviewed from the same directors of movies you have reviewed.
			</Typography>
			{
				Boolean(recommendationResults[0]) && 
				(<Typography>Watch more movies from these directors</Typography>)
			}
			
			<Grid item container md={10}>
				{
					recommendationResults.map(e => (
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
					{mainContent}
				</Paper>
			</div>
		</MuiThemeProvider>
	)
}

export default withStyles(styles)(Recommendations)