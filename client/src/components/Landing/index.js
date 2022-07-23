import React from 'react'
import { AppBar, Button, Paper, Toolbar, Typography } from '@material-ui/core'
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
});

const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer'
}

const Landing = () => {

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
                            to={'/myPage'}
                            style={linkStyle}
                        >
                            <Typography variant='h4'>myPage</Typography>
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
    )

  return (
    <MuiThemeProvider theme={theme}>
        <div className={styles.root}>
            <Paper className={styles.paper}
             style={{ minHeight: '100vh' }
            }>
                {navBar}
            </Paper>
        </div>
    </MuiThemeProvider>
  )
}

export default withStyles(styles)(Landing)