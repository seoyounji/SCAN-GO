import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Outline from '../Components/outline/Outline'
import Copyright from '../Components/outline/Copyright'
import useStyles from '../css/useStyles'

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Outline title={"Products"} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* 내용 입력 */}
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}