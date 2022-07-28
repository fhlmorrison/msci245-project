import React from 'react'
import { AppBar, Button, Grid, Paper, Toolbar, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import theme from '../Theme';

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
	descriptionText: {
		paddingLeft: '10vw',
	}
});

const linkStyle = {
	textDecoration: 'none',
	color: 'inherit',
	cursor: 'pointer'
}

const Landing = ({ classes }) => {

	const navBar = (
		<AppBar position='static'>
			<Toolbar>
				{/*Logo*/}
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

	const mainArea = (
		<Grid
			container
			direction='column'
			className={classes.mainArea}
		>
			<Typography
				variant={"h3"}
				align="left"
			>
				Welcome to
			</Typography>
			<Typography
				variant='h1'
			>
				&#127871; Popcorn Movie Reviews
			</Typography>
			<Typography
				variant='h5'
				color='textSecondary'
				className={classes.descriptionText}
			>
				Create or search through reviews for many popular movies
			</Typography>
		</Grid>
	)

	return (
		<MuiThemeProvider theme={theme}>
			<div className={classes.root}>
				<Paper className={classes.paper}
					style={{ minHeight: '100vh' }
					}>
					{navBar}
					{mainArea}
				</Paper>
			</div>
		</MuiThemeProvider>
	)
}

export default withStyles(styles)(Landing)