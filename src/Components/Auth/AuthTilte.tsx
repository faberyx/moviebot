/** @jsx createElement */
import { createElement } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Logo } from '../../assets/logo';

type Props = {
  title: string;
  variant?: 'h2' | 'inherit' | 'button' | 'overline' | 'caption' | 'h1' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'srOnly' | undefined;
};

export const AuthTitle = ({ title, variant = 'h3' }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.title}>
      <Grid container alignItems="center">
        <Grid>
          <Logo width="90px" />
        </Grid>
        <Grid>
          <Typography variant={variant} style={{ padding: '20px', fontWeight: 'bold', color: '#fff' }}>
            {title}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    width: '100%',
    backgroundImage: `linear-gradient(to right, rgb(28 54 95 / 69%) 150px, rgb(162 219 236 / 39%) 100%);`,
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    padding: '5px 15px'
  }
}));
