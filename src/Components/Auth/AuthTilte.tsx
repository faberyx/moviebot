/** @jsx createElement */
import { createElement } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import logo from '../../assets/logo.svg';

type Props = {
  title: string;
  variant?: 'h2' | 'inherit' | 'button' | 'overline' | 'caption' | 'h1' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'srOnly' | undefined;
};

export const AuthTitle = ({ title, variant = 'h3' }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.title}>
      <Grid container alignItems="center" classes={{ container: classes.container }}>
        <Grid>
          <Typography variant={variant} style={{ padding: '20px', fontWeight: 'bold', color: '#fff' }}>
            {title}
          </Typography>
        </Grid>
        <Grid>
          <img src={logo} alt="Logo" width="70px" />
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-end'
    }
  },
  title: {
    width: '100%',
    background: `url('/back_small.jpg') #2F2E40 no-repeat`,
    backgroundSize: 'contain',
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    padding: '5px 15px'
  }
}));
