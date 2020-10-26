/** @jsx createElement */
import { createElement, ReactNode, Fragment } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

type TabPanelProps = {
  children?: ReactNode;
  index: any;
  value: any;
};

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} className={classes.grid} {...other}>
      {value === index && <Fragment>{children}</Fragment>}
    </div>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  grid: {
    height: '100%'
  }
}));
